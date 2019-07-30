import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.page.html',
  styleUrls: ['./confirmar.page.scss'],
})
export class ConfirmarPage implements OnInit {
  private loading;

  service: string;
  email: string;
  cellphone: string;
  name: string;
  datetime: string;
  total: number;
  notes: string;

  toShip: boolean;
  address: string;
  city: string;

  daysLeft;

  itemsOnCart = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cartService: CartService,
    private firebaseService: FirebaseService,
    private authService: AuthenticationService,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params.email;
      this.cellphone = params.cellphone;
      this.name = params.name;
      this.datetime = params.datetime;
      this.address = params.address;
      this.toShip = Boolean(params.shipToAddress);
      this.city = params.city;
      this.notes = params.notes;
      this.daysLeft = this.daysBetween();
    });
  }

  ngOnInit() {
    this.updateTotalAndItemsOnCart();
  }

  daysBetween() {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(this.datetime);

    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  }

  updateTotalAndItemsOnCart() {
    const items = this.cartService.getCart();
    const selected = {};

    // I use this to count different items and calculate the total
    for (const obj of items) {
      if (selected[obj.id]) {
        selected[obj.id].count++;
      } else {
        selected[obj.id] = {...obj, count: 1};
      }
    }

    this.itemsOnCart = Object.keys(selected).map(key => selected[key]);
    this.total = this.itemsOnCart.reduce((a, b) => a + (b.count * b.product.price), 0);
  }

  RemoveItemFromCartEvent(item) {
    this.cartService.removeItemFromCart(item);
    this.updateTotalAndItemsOnCart();
  }

  getProductArray() {
    const arr = [];
    this.itemsOnCart.forEach(item => {
      arr.push(item);
    });
    return arr;
  }

  CreateRecord() {
    if (!this.authService.isLoggedIn) {
      this.showLoginAlert();
      return;
    }

    this.loadingController.create({ message: 'Reservando'}).then(overlay => {
      this.loading = overlay;
      this.loading.present();
    });

    const usr = JSON.parse(localStorage.getItem('user'));
    const record = {
      name: this.name,
      email: this.email,
      phone: this.cellphone,
      datetime: new Date(this.datetime),
      address: this.address,
      city: this.city,
      products: this.getProductArray(),
      status: 'Nuevo',
      notes: this.notes,
      uid: usr.uid,
      create_date: new Date(),
      gender: usr.info.gender
    };

    this.firebaseService.create_NewOrder(record).then(resp => {
      this.loading.dismiss();
      this.loading = null;
      this.presentSuccessAlert();
      this.cartService.resetCart();
      this.router.navigate(['home']);
    }).catch(error => {
      this.loading.dismiss();
      console.log(error);
      this.presentErrorAlert();
    });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Gracias por reservar en Beauty2Go 😀',
      message : 'Espera una llamada de confirmacion...',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Oops',
      message: 'Necesitas iniciar sesión para agendar',
      buttons: [{
        text: 'Ahora no',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Ingresar',
        cssClass: 'secondary',
        handler: () => {
          this.router.navigate(['login']);
        }
      }]
    });
    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Ocurrió un error 🙁',
      message : 'No se recibió tu información, inténtalo más tarde...',
      buttons: ['OK']
    });
    await alert.present();
  }

}

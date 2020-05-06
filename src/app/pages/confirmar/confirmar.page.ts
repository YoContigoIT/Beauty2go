import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CheckoutPage } from '../checkout/checkout.page';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-confirmar',
  providers: [CheckoutPage],
  templateUrl: './confirmar.page.html',
  styleUrls: ['./confirmar.page.scss'],
})
export class ConfirmarPage implements OnInit {
  private loading;

  service: string;
  email: string;
  cellphone: string;
  name: string;
  datetime: Date;
  total: number;
  notes;
  coupon: string;
  discount;
  toShip: boolean;
  address: string;
  city: string;
  record;

  selectedPaymentMethod = '';

  daysLeft;
  itemsOnCart = [];
  coupons: any;
  miobjeto;
  todiscount = 0;
  type = 'sindescuento';
  couponcount;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cartService: CartService,
    private firebaseService: FirebaseService,
    private authService: AuthenticationService,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private checkoutPage: CheckoutPage
    ) {
    this.route.queryParams.subscribe(params => {
      this.datetime = new Date(params.datetime);
      this.email = params.email;
      this.cellphone = params.cellphone;
      this.name = params.name;
      this.address = params.address;
      this.toShip = Boolean(params.shipToAddress);
      this.city = params.city;
      this.notes = params.notes;
      this.coupon = params.coupon;
      this.daysLeft = this.daysBetween();
    });
  }
  

  ngOnInit() {
    if(this.coupon == "") {this.coupon = " "; this.type = 'sincupon'}
    this.coupons = this.firebaseService.getCoupons(this.coupon).subscribe(data => {
     this.miobjeto = data;
     console.log('cupon:', this.miobjeto);
     this.updateTotalAndItemsOnCart();
    });
    
  }

  daysBetween() {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(this.datetime);

    const days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    return days;
  }

  updateTotalAndItemsOnCart() {
    const items = this.cartService.getCart();
    const selected = {};
    

    try{
      console.log('descuento: ', this.miobjeto["value"], this.miobjeto["type"]);

      this.type = this.miobjeto["type"]; //tipo de descuento menos o porciento
      if(!this.miobjeto['active']) this.type = 'caducado';
      this.couponcount = this.miobjeto["times_used"];

    }catch{
      this.type = 'sindescuento';
      this.todiscount = 0;
      
    }
    
    if(this.coupon == " ") {this.type = 'sincupon'}
    




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

    // if(this.type == 'caducado'){
    //   console.log('Su cupon ha caducado');
    // }else{
    //   if(this.type == 'menos' )
    //       this.todiscount = this.miobjeto["discount"];
    //   else if(this.type == 'porciento')
    //       this.todiscount = this.miobjeto["discount"] / 100 * this.total;
    // }
    switch(this.type){
      case 'menos':
        this.todiscount = this.miobjeto["value"]; break;
      case 'porciento':
        this.todiscount = this.miobjeto["value"] / 100 * this.total; break;
      case 'caducado':
        console.log('1 Su cupon ha caducado'); this.showAlert('El cupon ha caducado'); break;
      case 'sincupon':
        console.log('2 cupon no ingresado'); break;
      case 'sindescuento':
        console.log('3 cupon invalido'); this.showAlert('Cupon invalido'); break;
      default:
        console.log('4 cupon desconocido');

    }


    this.total += this.cartService.operationCharge;
    this.total -= this.todiscount;

    this.cartService.total = this.total;
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
    console.log('payment method:', this.selectedPaymentMethod);
    if (!this.authService.isLoggedIn) {
      this.showLoginAlert();
      return;
    }

    if (this.selectedPaymentMethod === '') {
      this.showPaymentMethodAlert();
      return;
    }

    const usr = JSON.parse(localStorage.getItem('user'));
    if (!this.notes) {
      this.notes = '';
    }
    this.record = {
      name: this.name,
      email: this.email,
      phone: this.cellphone,
      datetime: new Date(this.datetime),
      address: this.address,
      city: this.city,
      products: this.getProductArray(),
      status: 'Nuevo',
      notes: this.notes,
      coupon: this.coupon,
      uid: usr.uid,
      operation_charge: this.cartService.operationCharge,
      create_date: new Date(),
      gender: usr.info.gender,
      payment_method: this.selectedPaymentMethod,
      ammount: this.total
    };
    
    this.selectedPaymentMethod === 'Stripe' ? this.openCheckoutPopover() : this.createOrder();
    // this.openCheckoutPopover();
    // this.createOrder();
  }

  async openCheckoutPopover() {
    const popover = await this.modalController.create({
      component: CheckoutPage
    });
    popover.onDidDismiss().then((res) => {
      if (res.data === 'Paid order') {
        this.loadingController.create({ message: 'Reservando' }).then(overlay => {
          this.loading = overlay;
          this.loading.present();
        });
        this.createOrder();
      }
    });

    return await popover.present();
  }

  createOrder() {
    console.log('🤘trying 2 create order', JSON.stringify(this.record));
    // this.record.payment_id = this.cartService.paymentId;
    this.firebaseService.create_NewOrder(this.record).then(resp => {
      console.log(resp);
      this.firebaseService.updatecouponcount(this.couponcount+1, this.coupon);
      this.presentSuccessAlert();
      this.cartService.resetCart();
      this.router.navigate(['home']);
    }).catch(error => {
      console.log(error);
      this.presentErrorAlert(error);
    }).finally(() => {
      if (this.loading) this.loading.dismiss();
      // this.loading.dismiss();
    });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Gracias por reservar en Beauty To Go 😀',
      message : '',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async showPaymentMethodAlert() {
    const alert = await this.alertController.create({
      header: 'Oops',
      message: 'Selecciona un método de pago',
      buttons: ['OK']
    });
    await alert.present();
  }
  async showAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Oops',
      message: msg,
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

  async presentErrorAlert(error) {
    const alert = await this.alertController.create({
      header: 'Ocurrió un error 🙁',
      message : error,
      buttons: ['OK']
    });
    await alert.present();
  }

}

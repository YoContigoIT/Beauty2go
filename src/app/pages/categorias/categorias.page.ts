import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  private loading;
  productsSuscription;

  cart = [];
  categories = [];
  hasDeliveries: boolean;

  sliderConfig = {
    spaceBetween: 2,
    centeredSlides: true,
    slidesPerView: 1.4
  };

  constructor(private router: Router,
              private cartService: CartService,
              private authService: AuthenticationService,
              private alertController: AlertController,
              private loadingController: LoadingController) {

    loadingController.create({
      message: 'Cargando'
    }).then(overlay => {
      this.loading = overlay;
      this.loading.present();
    });

    this.productsSuscription = this.cartService.getCompanyProducts().subscribe(items => {

      const categoriesHash = {};
      items.forEach(element => {
        const prod = element.payload.doc.data() as any;
        if (!(prod.category in categoriesHash)) {
          categoriesHash[prod.category] = [];
        }

        categoriesHash[prod.category].push({
          id: element.payload.doc.id,
          product: prod
        });
      });

      this.categories = [];
      for (const key in categoriesHash) {
        if (categoriesHash.hasOwnProperty(key)) {
          this.categories.push({
            category_name: key,
            products: categoriesHash[key]
          });
        }
      }
      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);
    });
  }

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  ionViewWillLeave() {
    this.productsSuscription.unsubscribe();
  }

  openCart() {
    if (!this.authService.isLoggedIn) {

    }

    if (this.cart.length > 0) { this.router.navigate(['/agendar']); }
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

}

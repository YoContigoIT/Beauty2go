import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { FirebaseService } from '../../services/firebase.service';
import { tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  settings: any;
  cities = [];

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private fireService: FirebaseService,
    private alertController: AlertController
  ) {
    fireService.get_CompanySettings().subscribe(data => {
      this.settings = data;
    });
  }

  ngOnInit() {
    // const usr = JSON.parse(localStorage.getItem('user'));

    if (!this.authService.isLoggedIn) {
      const guest = JSON.parse(localStorage.getItem('guest'));
      if (guest === null) {
        this.fireService.getCities().subscribe(snap => {
          this.cities = [];
          snap.forEach(city => {
            const cityObj = city as any;
            this.cities.push({
              name: cityObj.city_name,
              type: 'radio',
              label: cityObj.city_name,
              value: cityObj.city_name
            });
          });
          this.presentCityAlert();
        });
      }
    }
  }

  async presentCityAlert() {
    const alert = await this.alertController.create({
      header: '¿En qué ciudad te encuentras?',
      inputs: this.cities,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Guardar',
          handler: (data: string) => {
            if (data !== undefined) {
              const guest = {
                city: data
              };
              localStorage.setItem('guest', JSON.stringify(guest));
            }
          }
        }
      ]
    });
    await alert.present();
  }

  navigateToCategories() {
    const guest = JSON.parse(localStorage.getItem('guest'));
    if (!this.authService.isLoggedIn && guest === null) {
      this.presentCityAlert();
      return;
    }
    this.router.navigate(['categorias']);
  }

  navigateToOrders() {
    this.router.navigate(['orders']);
  }
  navigateToLogin() {
    this.router.navigate(['login']);
  }

  logoutClicked() {
    this.authService.logoutUser().then(() => {
      this.router.navigate(['login']);
    });
  }

  privacyClicked() {
    window.open('http://beautytogo.mx/aviso-de-privacidad-app/', '_system', 'location=yes');
  }

  termsClicked() {
    window.open('http://beautytogo.mx/terminos-y-condiciones-del-servicio/', '_system', 'location=yes');
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  inputEmail = '';
  inputPassword = '';
  inputPasswordConfirmation = '';
  inputConditionsChecked: boolean;
  inputPrivacyChecked: boolean;
  inputName = '';
  inputGender = '';
  inputCity = '';

  availableCities = [];

  citiesSuscription;

  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private fireService: FirebaseService) { }

  ngOnInit() {
    this.citiesSuscription = this.fireService.getCities().subscribe(data => {
      this.availableCities = [];
      data.forEach(city => {
        this.availableCities.push(city);
      });
      console.log(this.availableCities);
    });
  }

  ionViewWillLeave() {
    this.citiesSuscription.unsubscribe();
  }

  tryRegister() {
    console.log(this.inputCity);

    if (this.inputEmail === '' || this.inputPassword === '' || this.inputPasswordConfirmation === ''
        || this.inputName === '') {
      this.presentAlert('No puede haber campos vacíos.', true);
      return;
    }
    if (this.inputGender === '') {
      this.presentAlert('Selecciona un género', true);
      return;
    }
    if (this.inputPassword !== this.inputPasswordConfirmation) {
      this.presentAlert('Las contraseñas no coinciden.', true);
      return;
    }
    if (this.inputPassword.length < 8) {
      this.presentAlert('Contraseña muy corta', true);
      return;
    }
    if (this.inputCity === '') {
      this.presentAlert('Selecciona una ciudad', true);
      return;
    }

    this.authService.registerUser(this.inputEmail, this.inputPassword, this.inputName, this.inputGender, this.inputCity).then((result) => {
      this.presentAlert('Usuario creado con éxito', false);
      this.router.navigate(['home']);
    }).catch((error) => {
      this.presentAlert('Hubo un error tratando de crearte una cuenta', true, error.message);
    });
  }

  // termsClicked() {
  //   window.open('https://beautyapp-1560984291083.firebaseapp.com/privacy', '_system', 'location=yes');
  // }

  async presentAlert(text: string, isError: boolean, message?: string) {
    let body = '';
    if (message) {
      body = message;
    } else {
      body = isError ? '😮' : '😄';
    }

    const alert = await this.alertController.create({
      header: text,
      message: body,
      buttons: ['OK']
    });
    await alert.present();
  }

}

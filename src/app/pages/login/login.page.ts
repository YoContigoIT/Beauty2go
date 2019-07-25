import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  inputEmail = '';
  inputPassword = '';

  constructor(private authService: AuthenticationService, private router: Router, private alertController: AlertController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.authService.isLoggedIn) { this.router.navigate(['home']); }
  }

  login() {
    if (this.inputEmail === '' || this.inputPassword === '') {
      console.log('fields cannot be empty');
      return;
    }

    this.authService.loginUser(this.inputEmail, this.inputPassword).then((result) => {
      this.router.navigate(['home']);
    }).catch((error) => {
      this.presentLoginError(error.message);
    });
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToRegisterWindow() {
    this.router.navigate(['register']);
  }

  async presentLoginError(err: string) {
    const alert = await this.alertController.create({
      header: 'Ocurrió un error 🙁',
      message : err,
      buttons: ['OK']
    });
    await alert.present();
  }

}

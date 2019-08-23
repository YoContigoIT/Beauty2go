import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseService } from '../services/firebase.service';
import { FcmService } from './fcm.service';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router,
              public afAuth: AngularFireAuth,
              private fireService: FirebaseService,
              private fcmService: FcmService,
              public toastController: ToastController) {
    afAuth.authState.subscribe(user => {
      if (user) {
        fireService.getUserInfo(user.uid).then(res => {
          const userInfo = {
            uid: res.id,
            info: res.data(),
          };
          if (userInfo.info.role !== 'client') {
            this.logoutUser();
            return;
          } else {
            this.fcmService.getToken();

            this.fcmService.listenToNotifications().pipe(
              tap(msg => {
                this.presentToast(msg);
              })
            ).subscribe();
            localStorage.setItem('guest', null);
            localStorage.setItem('user', JSON.stringify(userInfo));
            router.navigate(['home']);
          }
        });
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg.body,
      duration: 3000
    });
    await toast.present();
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  loginUser(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string, name: string, gender: string, city: string) {
    return new Promise<any>((result, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(
        res => {
          this.fireService.createUserInfo(res.user.uid, name, gender, city, email);
          res.user.updateProfile({
            displayName: name
          }).then();
          result(res);
        },
        err => reject(err)
      );
    });
  }

  async logoutUser() {
    localStorage.setItem('user', null);
    return this.afAuth.auth.signOut();
  }
}

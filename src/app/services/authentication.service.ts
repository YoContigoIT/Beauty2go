import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, public afAuth: AngularFireAuth, private fireService: FirebaseService) {
    afAuth.authState.subscribe(user => {
      if (user) {
        // this.user = user;
        fireService.getUserInfo(user.uid).then(res => {
          const userInfo = {
            uid: res.id,
            info: res.data()
          };
          if (userInfo.info.role !== 'client') {
            this.logoutUser();
            return;
          } else {
            localStorage.setItem('user', JSON.stringify(userInfo));
            router.navigate(['home']);
          }
        });
      } else {
        // this.user = null;
        localStorage.setItem('user', null);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  loginUser(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string, name: string, gender: string) {
    return new Promise<any>((result, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(
        res => {
          this.fireService.createUserInfo(res.user.uid, name, gender);
          // console.log(res);
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
    return this.afAuth.auth.signOut();
  }
}

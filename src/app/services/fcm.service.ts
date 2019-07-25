import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    public firebaseNative: Firebase,
    public afirestore: AngularFirestore,
    private platform: Platform
  ) { }

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    if (this.platform.is('cordova')) {
    }

    return this.saveTokenToFirestore(token);
  }

  private saveTokenToFirestore(token: string) {
    if (!token) { return; }
    const usersRef = this.afirestore.collection('users');
    const userUid = JSON.parse(localStorage.getItem('user')).uid;
    return usersRef.doc(userUid).update({ token });
  }

  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

}

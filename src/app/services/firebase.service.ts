import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  readonly companyName = 'beauty2go';

  constructor(private aFirestore: AngularFirestore) { }

  create_NewOrder(record) {
    return this.aFirestore.collection('orders').add(record);
  }

  get_CompanySettings() {
    return this.aFirestore.collection('settings').doc(this.companyName).valueChanges();
  }

  getUpcomingOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.aFirestore.collection('orders', ref => ref
      .where('uid', '==', user.uid)
      .where('status', '>=', 'D')
      ).snapshotChanges();
  }

  getPastOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.aFirestore.collection('orders', ref => ref
      .where('uid', '==', user.uid)
      .where('status', '<', 'D')
      ).snapshotChanges();
  }

  updateOrderStatus(id, value) {
    return this.aFirestore.collection('orders').doc(id).update({ status: value });
  }

  updateOrderRating(orderId, value) {
    return this.aFirestore.collection('orders').doc(orderId)
      .update({ rating: value });
  }

  pushReportToOrder(orderId, reportText: string) {
    return this.aFirestore.collection('reports').doc(orderId).set(
      {
        notes: firestore.FieldValue.arrayUnion({ date: firestore.Timestamp.now(), message: reportText })
      }, { merge: true});
  }

  createUserInfo(uid: string, realName: string, realGender: string) {
    return this.aFirestore.collection('users').doc(uid)
      .set({
        name: realName,
        gender: realGender,
        role: 'client'
    });
  }

  getUserInfo(uid: string) {
    return this.aFirestore.collection('users').doc(uid).ref.get();
  }

}

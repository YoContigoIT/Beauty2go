import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { resolve } from 'url';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  readonly companyName = 'beauty2go';

  constructor(private aFirestore: AngularFirestore) { }

  // COMPANY
  get_CompanySettings() {
    return this.aFirestore.collection('settings').doc(this.companyName).valueChanges();
  }

  // ORDERS
  async create_NewOrder(record) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      const usr = JSON.parse(localStorage.getItem('user'));
      this.addOrder(record).then(res => {
        const orderId = res.id;
        record.products.forEach(prod => {
          const job = {
            appointment_date: record.datetime,
            city: record.city,
            client_id: usr.uid,
            order_id: orderId,
            products: prod,
            product_id: prod.id,
            job_status: 'Nuevo'
          };
          this.addJob(job);
        });
        resolve();
      }).catch(err => {
        reject(err);
      });
    });

    // tslint:disable-next-line:no-shadowed-variable
    // return new Promise((resolve, reject) => {
    //   console.log('recorf', record);
    //   const usr = JSON.parse(localStorage.getItem('user'));
    //   // tslint:disable-next-line:prefer-for-of
    //   for (let i = 0; i < record.products.length; i++) {
    //     const job = {
    //       appointment_date: record.datetime,
    //       city: record.city,
    //       client_id: usr.uid,
    //       // order_id
    //       product: record.products[i],
    //       job_status: 'Nuevo'
    //     };
    //     // jobs.push(job);
    //     this.addJob(job).then(data => {
    //       record.products[i].product.job_id = data;
    //       this.addOrder(record).then(ok => {
    //         resolve('ok');
    //       }).catch(err => {
    //         console.log(err);
    //         reject(err);
    //       });
    //     }).catch(err => {
    //       console.log(err);
    //       reject(err);
    //     });
    //   }
    // });
  }

  addJob(job) {
    this.aFirestore.collection('jobs').add(job);

    // tslint:disable-next-line:no-shadowed-variable
    // return new Promise((resolve, reject) => {
    //   // tslint:disable-next-line:prefer-for-of
    //   for (let i = 0; i < jobArray.length; i++) {
    //     this.aFirestore.collection('jobs').add(jobArray[i]).then(res => {
    //       // rec.products[i].product.job_id = res.id;
    //       resolve(res.id);
    //     }).catch(err => {
    //       console.log(err);
    //       reject(err);
    //     });
    //   }

    // });
  }

  addOrder(record) {
    return this.aFirestore.collection('orders').add(record);
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
      .update({ products: value });
  }

  pushReportToOrder(orderId, reportText: string) {
    return this.aFirestore.collection('reports').doc(orderId).set(
      {
        notes: firestore.FieldValue.arrayUnion({ date: firestore.Timestamp.now(), message: reportText })
      }, { merge: true });
  }

  getJobs(orderId: string) {
    return this.aFirestore.collection('jobs', ref => ref.where('order_id', '==', orderId)).snapshotChanges();
  }

  updateJobRating(jobId, value) {
    return this.aFirestore.collection('jobs').doc(jobId).update({
      rating: value
    });
  }

  // USER
  createUserInfo(uid: string, realName: string, realGender: string, realCity: string) {
    return this.aFirestore.collection('users').doc(uid)
      .set({
        name: realName,
        gender: realGender,
        role: 'client',
        city: realCity
      });
  }

  getUserInfo(uid: string) {
    return this.aFirestore.collection('users').doc(uid).ref.get();
  }

  // PROVIDERS
  getProviderInfo(providerId: string) {
    return this.aFirestore.collection('employees').doc(providerId).snapshotChanges();
  }

  // CITIES
  getCities() {
    return this.aFirestore.collection('cities', ref => ref.orderBy('city_name')).valueChanges();
  }

}

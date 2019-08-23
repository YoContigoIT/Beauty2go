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
  create_NewOrder(record) {
    // const usr = JSON.parse(localStorage.getItem('user'));
    // return this.addOrder(record).then(res => {
    //   const promiseArray = [];
    //   const orderId = res.id;
    //   record.products.forEach(prod => {
    //     const job = {
    //       appointment_date: record.datetime,
    //       city: record.city,
    //       client_id: usr.uid,
    //       order_id: orderId,
    //       products: prod,
    //       product_id: prod.id,
    //       job_status: 'Nuevo',
    //       paid: false
    //     };
    //     this.addJob(job);
    //   });
    //   // return Promise.all(promiseArray);
    // }).catch(reason => {
    //   console.log(reason);
    //   return;
    // });

    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      const promiseArray = [];
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
            job_status: 'Nuevo',
            paid: false
          };
          console.log('job: ', JSON.stringify(job));
          promiseArray.push(this.addJob(job));
        });
        Promise.all(promiseArray).then(() => {
          resolve();
        }).catch(e => {
          reject(e);
        });
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
    return this.aFirestore.collection('jobs').add(job);
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
      .where('status', '>=', 'D').orderBy('status').orderBy('datetime')
    ).snapshotChanges();
  }

  getPastOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.aFirestore.collection('orders', ref => ref
      .where('uid', '==', user.uid)
      .where('status', '<', 'D').orderBy('status').orderBy('datetime')
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
  createUserInfo(uid: string, realName: string, realGender: string, realCity: string, mail: string) {
    return this.aFirestore.collection('users').doc(uid)
      .set({
        name: realName,
        gender: realGender,
        role: 'client',
        city: realCity,
        active: true,
        member_since: new Date(),
        email: mail
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
    return this.aFirestore.collection('cities', ref => ref.where('active', '==', true).orderBy('city_name')).valueChanges();
  }

}

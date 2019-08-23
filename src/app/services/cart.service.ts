import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = [];
  products;
  operationCharge = 100;
  total: number;
  customerEmail: string;
  paymentId = '';

  canPlaceOrders = false;

  constructor(private afirestore: AngularFirestore, fireService: FirebaseService) {
    let usr = JSON.parse(localStorage.getItem('user'));
    if (usr === null) {
      usr = JSON.parse(localStorage.getItem('guest'));
    }

    fireService.get_CompanySettings().subscribe(e => {
      const element = e as any;
      this.canPlaceOrders = element.can_place_orders;
    });
  }

  getCompanyProducts() {
    let city = '';
    let usr = JSON.parse(localStorage.getItem('user'));
    if (usr === null) {
      usr = JSON.parse(localStorage.getItem('guest'));
      city = usr.city;
    } else {
      city = usr.info.city;
    }
    return this.afirestore.collection('products',
      ref => ref.where('active', '==', true).where('city', '==', city).orderBy('price', 'desc')).snapshotChanges();
  }

  getCart() {
    return this.cart;
  }

  addItemToCart(product) {
    this.cart.push(product);
  }

  removeItemFromCart(product) {
    this.cart = this.cart.filter(x => x.id !== product.id);
  }

  resetCart() {
    this.cart = [];
  }

  pushLogs(obj) {
    this.afirestore.collection('logs').add(obj);
  }

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = [];
  products;

  constructor(private afirestore: AngularFirestore) {
    let usr = JSON.parse(localStorage.getItem('user'));
    if (usr === null) {
      usr = JSON.parse(localStorage.getItem('guest'));
    }
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
      ref => ref.where('active', '==', true).where('city', '==', city)).snapshotChanges();
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

}

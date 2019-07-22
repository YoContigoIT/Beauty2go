import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = [];
  products;

  constructor(private afirestore: AngularFirestore) {
    this.products = this.afirestore.collection('products', ref => ref.where('active', '==', true)).snapshotChanges();
  }

  getCompanyProducts() {
    return this.products;
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

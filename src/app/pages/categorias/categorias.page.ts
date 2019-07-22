import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  productsSuscription;

  cart = [];
  categories = [];
  hasDeliveries: boolean;

  sliderConfig = {
    spaceBetween: 2,
    centeredSlides: true,
    slidesPerView: 1.4
  };

  constructor(private router: Router, private cartService: CartService) {
    this.productsSuscription = this.cartService.getCompanyProducts().subscribe(items => {
      const categoriesHash = {};
      items.forEach(element => {
        if (!(element.payload.doc.data().category in categoriesHash)) {
          categoriesHash[element.payload.doc.data().category] = [];
        }

        categoriesHash[element.payload.doc.data().category].push({
          id: element.payload.doc.id,
          product: element.payload.doc.data()
        });

      });

      this.categories = [];
      for (const key in categoriesHash) {
        if (categoriesHash.hasOwnProperty(key)) {
          this.categories.push({
            category_name: key,
            products: categoriesHash[key]
          });
        }
      }
    });
  }

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  ionViewWillLeave() {
    this.productsSuscription.unsubscribe();
  }

  openCart() {
    if (this.cart.length > 0) { this.router.navigate(['/agendar']); }
  }

}

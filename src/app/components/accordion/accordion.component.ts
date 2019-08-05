import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  accordionExpanded = true;
  @ViewChild('cc') cardContent: any;
  // tslint:disable-next-line:no-input-rename
  @Input('category') category;

  sliderConfig = {
    spaceBetween: 2,
    centeredSlides: true,
    slidesPerView: 1.4
  };

  constructor(private cartService: CartService) { }

  ngOnInit() {}

  toggleAccordion() {
    this.accordionExpanded = !this.accordionExpanded;
  }

  addToCart(product) {
    if (this.alreadyOnCart(product)) {
      this.cartService.removeItemFromCart(product);
    } else {
      this.cartService.addItemToCart(product);
    }
  }

  alreadyOnCart(product) {
    const currentCart = this.cartService.getCart();
    const occurrences = currentCart.filter((x) => x.id === product.id);
    return occurrences.length > 0;
  }

}

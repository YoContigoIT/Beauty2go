import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PopoverController } from '@ionic/angular';
import { RatePopoverPage } from '../../../components/rate-popover/rate-popover.page';

@Component({
  selector: 'app-upcoming-orders',
  templateUrl: './upcoming-orders.page.html',
  styleUrls: ['./upcoming-orders.page.scss'],
})
export class UpcomingOrdersPage implements OnInit {
  upcomingOrders = [];

  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private popoverController: PopoverController
    ) { }

  ngOnInit() {
    this.firebase.getUpcomingOrders().subscribe(snapshot => {
      this.upcomingOrders = [];
      snapshot.forEach(element => {
        this.upcomingOrders.push(
          {
            id: element.payload.doc.id,
            order: element.payload.doc.data()
          }
        );
      });
      this.sortOrders();
    });
  }

  sortOrders() {
    this.upcomingOrders = this.upcomingOrders.sort((a, b) =>
      (a.order.datetime > b.order.datetime) ? 1 : -1
    );
  }

  getHelpClicked(order) {
    // console.log(order);
    this.router.navigate(['get-help'], { queryParams: {
      id: order.id,
      city: order.order.city,
      status: order.order.status,
      uid: order.order.uid
     } });
  }

  async openPopover(ev: Event, order) {
    const popover = await this.popoverController.create({
      component: RatePopoverPage,
      componentProps: {
        order
      },
      cssClass: 'rate-popover',
      event: ev
    });
    popover.present();
  }

}

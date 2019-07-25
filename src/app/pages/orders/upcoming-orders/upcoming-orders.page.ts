import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
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
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.firebase.getUpcomingOrders().subscribe(snapshot => {
      this.upcomingOrders = [];
      snapshot.forEach(order => {
        this.upcomingOrders.push({
          id: order.payload.doc.id,
          order: order.payload.doc.data()
        });
      });
      // this.addJobInfo();
      this.sortOrders();
      this.assignProviderNames();
    });
  }

  assignProviderNames() {
    this.upcomingOrders.forEach(order => {
      order.order.products.forEach(prod => {
        if (prod.product.provider !== undefined) {
          this.firebase.getProviderInfo(prod.product.provider).subscribe(snapshot => {
            const fireSnapshot = snapshot.payload.data() as any;
            prod.product.provider_name = fireSnapshot.name;
          });
        }
      });
    });
  }

  // addJobInfo() {
  //   this.upcomingOrders.forEach(order => {
  //     this.firebase.getJobs(order.id).then(snap => {
  //       snap.forEach(job => {
  //         order.order.products.forEach(product => {
  //           if (job.data().product.id === product.id) {
  //             product.product.job_info = {
  //               job_id: job.id,

  //             };
  //           }
  //         });
  //       });
  //     });
  //   });
  //   console.log('completed :)', this.upcomingOrders);
  // }

  sortOrders() {
    this.upcomingOrders = this.upcomingOrders.sort((a, b) =>
      (a.order.datetime > b.order.datetime) ? 1 : -1
    );
  }

  getHelpClicked(order) {
    this.router.navigate(['get-help'], { queryParams: {
      id: order.id,
      city: order.order.city,
      status: order.order.status,
      uid: order.order.uid
     } });
  }

  async openPopover(ev: Event, order) {
    const popover = await this.modalController.create({
      component: RatePopoverPage,
      componentProps: {
        order
      },
      cssClass: 'rate-popover'
    });
    popover.present();
  }

}

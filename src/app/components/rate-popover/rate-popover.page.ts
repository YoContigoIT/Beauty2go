import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rate-popover',
  templateUrl: './rate-popover.page.html',
  styleUrls: ['./rate-popover.page.scss'],
})
export class RatePopoverPage implements OnInit {
  missingRating = true;
  auxArray = [];
  passedOrder;

  jobs = [];

  fullStar = 'ios-star';
  emptyStar = 'ios-star-outline';

  constructor(
    private fireService: FirebaseService,
    private navParams: NavParams,
    private modalController: ModalController) { }

  ngOnInit() {
    this.passedOrder = this.navParams.get('order');
    this.passedOrder.order.products.forEach(product => {
      product.product.rating = 0;
      this.auxArray.push(false);
      if (product.product.provider !== undefined) {
        this.fireService.getProviderInfo(product.product.provider).subscribe(snapshot => {
          const fireData = snapshot.payload.data() as any;
          product.product.provider_name = fireData.name;
        });
      }
    });

    this.fireService.getJobs(this.passedOrder.id).subscribe(res => {
      this.jobs = [];
      res.forEach(job => {
        this.jobs.push({
          id: job.payload.doc.id,
          job: job.payload.doc.data() as any
        });
      });
    });
  }

  async closePopover() {
    await this.modalController.dismiss();
  }

  updateRating(product, rateValue, index) {
    this.auxArray[index] = true;
    product.product.rating = rateValue;
    this.determineButtonDisabled();
  }

  determineButtonDisabled() {
    this.missingRating = this.auxArray.filter(item => {
      return item === false;
    }).length > 0;
  }

  rateAndFinishOrder() {
    this.fireService.updateOrderStatus(this.passedOrder.id, 'Completado');
    this.fireService.updateOrderRating(this.passedOrder.id, this.passedOrder.order.products);

    // actualizar los jobs
    for (const job of this.jobs) {
      for (const prod of this.passedOrder.order.products) {
        if (job.job.product_id === prod.id) {
          this.fireService.updateJobRating(job.id, prod.product.rating);
          break;
        }
      }
    }
    this.closePopover();
  }

}

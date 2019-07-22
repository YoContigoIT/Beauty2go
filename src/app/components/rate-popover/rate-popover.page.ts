import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-rate-popover',
  templateUrl: './rate-popover.page.html',
  styleUrls: ['./rate-popover.page.scss'],
})
export class RatePopoverPage implements OnInit {
  passedOrder;

  constructor(
    private fireService: FirebaseService,
    private navParams: NavParams,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.passedOrder = this.navParams.get('order');
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  starClicked(value) {
    console.log('clicked:', this.passedOrder.id);
    // TODO: hit database and change status
    this.fireService.updateOrderRating(this.passedOrder.id, value).then(() => {
      this.fireService.updateOrderStatus(this.passedOrder.id, 'Completado');
    }).catch(err => {
      console.log('Error trying to rate this order: ', err);
    }).finally(() => {
      this.closePopover();
  });
  }

}

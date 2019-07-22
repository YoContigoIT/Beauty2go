import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.page.html',
  styleUrls: ['./past-orders.page.scss'],
})
export class PastOrdersPage implements OnInit {
  pastOrders = [];

  constructor(private firebase: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.firebase.getPastOrders().subscribe(snapshot => {
      this.pastOrders = [];
      snapshot.forEach(element => {
        this.pastOrders.push(
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
    this.pastOrders = this.pastOrders.sort((a, b) =>
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

}

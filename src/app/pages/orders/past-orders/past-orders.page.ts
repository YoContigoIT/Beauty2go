import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.page.html',
  styleUrls: ['./past-orders.page.scss'],
})
export class PastOrdersPage implements OnInit {
  pastOrdersAux = [];
  pastOrders = [];

  constructor(private firebase: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.firebase.getPastOrders().subscribe(snapshot => {
      this.pastOrdersAux = [];
      snapshot.forEach(element => {
        this.pastOrdersAux.push(
          {
            id: element.payload.doc.id,
            order: element.payload.doc.data()
          }
        );
      });
      this.pastOrders = this.pastOrdersAux;
      this.pastOrdersAux = [];
    });
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

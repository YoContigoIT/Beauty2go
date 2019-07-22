import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'orders',
    component: TabsPage,
    children: [
      {
        path: 'past-orders',
        loadChildren: '../past-orders/past-orders.module#PastOrdersPageModule'
      },
      {
        path: 'upcoming-orders',
        loadChildren: '../upcoming-orders/upcoming-orders.module#UpcomingOrdersPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'orders/upcoming-orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}

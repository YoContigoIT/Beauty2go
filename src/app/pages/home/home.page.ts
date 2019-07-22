import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { FirebaseService } from '../../services/firebase.service';

import { FcmService } from '../../services/fcm.service';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  settings: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private fireService: FirebaseService,
    public fcmProvider: FcmService,
    public toastController: ToastController
    ) {
    fireService.get_CompanySettings().subscribe(data => {
      this.settings = data;
    });
  }

  position = 'initial';

  sliderImages = [
    'assets/img/instalaciones.jpeg',
    'assets/img/manicure.jpg',
    'assets/img/pedicure.jpg'
  ];

  sliderConfig = {
    spaceBetween: 3,
    centeredSlides: true,
    slidesPerView: 1.6,
    loop: true,
    initialSlide: 0,
    autoplay: true
  };

  ngOnInit() {
    $(document).ready(() => {
      $('#sidebarCollapse').on('click', () => {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
      });
    });
    this.fcmProvider.getToken();

  }

  navigateToCategories() {
    this.router.navigate(['categorias']);
  }

  navigateToOrders() {
    this.router.navigate(['orders']);
  }

  logoutClicked() {
    this.authService.logoutUser();
  }

  privacyClicked() {
    window.open('https://beautyapp-1560984291083.firebaseapp.com/privacy', '_system', 'location=yes');
  }

}

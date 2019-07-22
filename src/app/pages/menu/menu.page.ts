import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  loggedIn = false;

  constructor(private authService: AuthenticationService) {
    this.loggedIn = authService.isLoggedIn;
  }

  ngOnInit() {
  }

  logoutClicked() {
    this.authService.logoutUser();
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireFunctionsModule } from 'angularfire2/functions';
import { environment } from '../environments/environment';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmService } from './services/fcm.service';
import * as $ from 'jquery';
import { RatePopoverPageModule } from './components/rate-popover/rate-popover.module';
import { CheckoutPageModule } from './pages/checkout/checkout.module';
import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RatePopoverPageModule,
    CheckoutPageModule,
    AngularFireFunctionsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Firebase,
    FcmService,
    Stripe,
    HttpClient,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

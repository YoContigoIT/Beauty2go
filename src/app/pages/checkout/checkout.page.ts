import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Stripe } from '@ionic-native/stripe/ngx';
import { CartService } from 'src/app/services/cart.service';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
  readonly URL = 'https://us-central1-beautyapp-1560984291083.cloudfunctions.net/payWithStripe';

  paymentAmount: string;
  currencyIcon = '$';
  // TODO: use production key and remove test card numbers
  stripeKey = 'pk_live_IOv2Rl10PbU5WRMFe7of7KwF00gBu2DFLY'; 

  passedInfo;
  private loading;

  cardDetails = {
    number: 0,
    expMonth: 0,
    expYear: 0,
    cvc: 0,
  };

  constructor(
    private modalControler: ModalController,
    private stripeNative: Stripe,
    private cartService: CartService,
    public loadingController: LoadingController,
    private nativeHTTP: HTTP) {}

  ngOnInit() {
    this.paymentAmount = this.cartService.total.toString();
    this.stripeNative.setPublishableKey(this.stripeKey);
  }

  pay() {
    if (this.isEmptyStringOrZero(this.cardDetails.number)) {
      alert('Ingresa un número de tarjeta');
      return;
    }
    if (this.isEmptyStringOrZero(this.cardDetails.expMonth)) {
      alert('Ingresa un mes de expiración');
      return;
    }
    if (this.isEmptyStringOrZero(this.cardDetails.expYear)) {
      alert('Ingresa un año de expiración');
      return;
    }
    if (this.isEmptyStringOrZero(this.cardDetails.cvc)) {
      alert('Ingresa el número CVC(número de tres dígitos que aparece en la parte trasera de la tarjeta)');
      return;
    }
    this.loadingController.create({
      message: 'Pagando de forma segura...'
    }).then(overlay => {
      this.loading = overlay;
      this.loading.present();
    });
    this.stripeNative.createCardToken({
      number: this.cardDetails.number.toString(),
      expMonth: +this.cardDetails.expMonth,
      expYear: +this.cardDetails.expYear,
      cvc: this.cardDetails.cvc.toString()
    }).then(res => {
      const user = JSON.parse(localStorage.getItem('user'));
      const data = {
        amount: this.cartService.total * 100,
        source: res.id,
        currency: 'mxn',
        description: 'Servicio solicitado en Beauty To Go',
        receipt_email: this.cartService.customerEmail,
        uid: user.uid
      };

      // NATIVE
      this.payCloudFunction(data).then(response => {
        if (response.status === 200) {
          this.cartService.paymentId = response.data.payment;
          this.loading.dismiss();
          this.modalControler.dismiss('Paid order');
        }
      }).catch(err => {
        alert('err: ' + JSON.stringify(err));
      }).finally(() => {
        this.loading.dismiss();
      });
    }).catch(e => {
      this.loading.dismiss();
      alert(JSON.stringify(e));
    });
  }

  payCloudFunction(data) {
    return this.nativeHTTP.post(this.URL, data, {
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/plain;charset=UTF-8',
      // tslint:disable-next-line:object-literal-key-quotes
      'Connection': 'close'
    });
  }

  cancel() {
    this.modalControler.dismiss('User cancelled checkout');
  }

  isEmptyStringOrZero(value) {
    return value === '' || value === 0;
  }

}

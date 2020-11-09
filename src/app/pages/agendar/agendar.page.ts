import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
})
export class AgendarPage implements OnInit {
  formgroup: FormGroup;
  name: AbstractControl;
  email: AbstractControl;
  cellphone;
  service: string;
  address: AbstractControl;
  notes;
  coupon;
  selectedDate;
  selectedTime;
  auxSelectedTime;
  formattedDatetime;
  phoneAux = '';
  selectedCity = '';
  selectedCellphone = '';

  month;
  minutes;

  dateWasSelected = false;
  timeWasSelected = false;
  shipToAddress = false;

  user;

  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private cartService: CartService) {

      this.route.queryParams.subscribe(params => {
        this.service = params.service;
      });
      this.formgroup = formbuilder.group({
        name: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ.-]+')])],
        email: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(80),
          // tslint:disable-next-line:max-line-length
          Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
        ]
        )],
        address: ['', Validators.compose([
          Validators.minLength(4)
        ])]
        
      });
      this.name = this.formgroup.controls.name;
      this.email = this.formgroup.controls.email;
      this.cellphone = this.formgroup.controls.cellphone;
      this.address = this.formgroup.controls.address;
      this.coupon = '';
      this.preloadFormFields();
    }

  ngOnInit() { }

  updateDate(event) {
    this.dateWasSelected = true;
    this.selectedDate = new Date(event.detail.value);
    this.month = (+this.selectedDate.getMonth() + 1).toString();
    this.month = this.convertoToTwoDigits(this.month);
    this.selectedDate =
      `${this.selectedDate.getFullYear()}-${this.month}-${this.convertoToTwoDigits(this.selectedDate.getDate())}`;
  }

  preloadFormFields() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email.setValue(this.user.info.email);
    this.name.setValue(this.user.info.name);
    this.selectedCity = this.user.info.city; 
  }

  updateTime(event) {
    this.timeWasSelected = true;
    this.selectedTime = new Date(event.detail.value);
    this.selectedTime = `${this.selectedTime.getHours()}:${this.convertoToTwoDigits(this.selectedTime.getMinutes())}:00`;
  }

  getCurrentTime() {
    const now = new Date();
    // tslint:disable-next-line:max-line-length
    const stringDate = `${now.getFullYear()}-${this.convertoToTwoDigits((now.getMonth() + 1).toString())}-${this.convertoToTwoDigits(now.getDate().toString())}`;
    return stringDate;
  }

  convertoToTwoDigits(old) {
    old = old.toString();
    return (old.length < 2) ? `0${old}` : old;
  }

  bookForm() {
    if (this.isEmptyString(this.selectedCity)) {
      this.presentAlert('ciudad');
      return;
    }
    if (this.isEmptyString(this.name.value)) {
      this.presentAlert('nombre');
      return;
    }
    if (this.isEmptyString(this.email.value)) {
      this.presentAlert('email');
      return;
    }
    if (this.isEmptyString(this.selectedCellphone)) {
      this.presentAlert('telefono');
      return;
    }
    if (!this.dateWasSelected || !this.timeWasSelected) {
      this.presentAlert('fecha y hora');
      return;
    }

    // check if selected date is at least 3 hours ahead
    const THREE_HOURS = 3 * (60 * 60 * 1000);
    const mergedDate = new Date(`${this.selectedDate}T${this.selectedTime}-05:00`);

    if ((Number(mergedDate) - Number(new Date())) < (THREE_HOURS)) {
      this.presentNotEnoughTimeAlert();
      return;
    }
    if (this.isEmptyString(this.address.value)) {
      this.presentAlert('domicilio');
      return;
    }

    this.cartService.customerEmail = this.email.value;

    this.router.navigate(['/confirmar'], { queryParams:
      { name: this.name.value,
        email: this.email.value,
        cellphone: this.selectedCellphone,
        service: this.service,
        // datetime: mergedDate,
        datetime: `${this.selectedDate}T${this.selectedTime}-05:00`,
        shipToAddress: true,
        address: this.address.value,
        city: this.selectedCity,
        notes: this.notes,
        coupon: this.coupon
      }
    });
  }

  isEmptyString(str: string) {
    return str === '';
  }

  somethingTyped(event) {
    const typed = event.detail.data;
    if (typed == null) {
      this.phoneAux = this.phoneAux.replace(/.$/, '');
      return;
    }
    if (this.isNumeric(typed)) {
      this.phoneAux += typed;
      return;
    }
    if (!this.isNumeric(typed)) {
      this.selectedCellphone = this.phoneAux;
    }
  }

  isNumeric(char): boolean {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    for (const element of numbers) {
      if (element === char) {
        return true;
      }
    }
    return false;
  }

  private async presentAlert(kind: string) {
    const msg = (kind === 'fecha y hora' || kind === 'ciudad') ? `Por favor selecciona una ${kind}` : `Por favor ingresa un ${kind}`;

    const alert = await this.alertController.create({
      header: msg,
      message : ':)',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async presentNotEnoughTimeAlert() {
    const alert = await this.alertController.create({
      header: 'Necesitamos más tiempo para organizar tu cita',
      message : 'Debes agendar con al menos 3 horas de anticipación',
      buttons: ['OK']
    });
    await alert.present();
  }

}

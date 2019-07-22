import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-get-help',
  templateUrl: './get-help.page.html',
  styleUrls: ['./get-help.page.scss'],
})
export class GetHelpPage implements OnInit {
  order = {
    status: '',
    id: '',
    city: '',
    uid: ''
  };

  constructor(
    private fireService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.order = {
        id: params.id,
        city: params.city,
        status: params.status,
        uid: params.uid
      };
    });
  }

  async otroClicked() {
    const prompt = await this.alertController.create({
      message: 'Cuéntanos',
      inputs: [{
        name: 'message',
        placeholder: 'Escribe aquí tu mensaje'
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
        }
      },
      {
        text: 'Enviar',
        handler: data => {
          if (data.message.length < 3) {
            alert('Tu mensaje de reporte es muy corto.');
          } else {
            this.fireService.pushReportToOrder(this.order.id, data.message).then(() =>
              alert('Listo. Nos pondremos en contacto contigo pronto :)')
            ).catch(err => {
              alert('Algo ocurrió :(  Inténtalo otra vez');
              console.log(err);
            });
          }
        }
      }]
    });
    await prompt.present();
  }

  cancelOrderClicked() {
    this.presentConfirmationAlert();
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres cancelar esta cita?',
      message: 'Se pueden aplicar cargos',
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Si',
        cssClass: 'secondary',
        handler: () => {
          // TODO
          // this.fireService.(this.order.id);
          this.fireService.updateOrderStatus(this.order.id, 'Cancelado por cliente').then(() => {
            this.router.navigate(['orders']).catch(err => {
              console.log('Algo pasó', err);
            });
          });
        }
      }]
    });
    await alert.present();
  }

}

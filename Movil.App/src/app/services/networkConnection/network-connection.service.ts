import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Network } from '@capacitor/network';



@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionService {

  constructor(
    private alertController: AlertController,
  ) { }


  getNetworkStatus(){
    this._getNetworkStatus().then((status) => {
      if(!status.connected){
        this.showMessage();
        return;
      }
    })
  }
  
  async _getNetworkStatus(){
    return await Network.getStatus();
  }


  async showMessage() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      subHeader: '',
      message: 'Sin conexión a internet, favor conectese a una red para poder navegar en la aplicación. Asegúrese de tener el (Wifi o Datos celulares) encendio',
      buttons: ['OK']
    });

    await alert.present();
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { Inventory } from 'src/app/models/inventory';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { CountingPage } from '../../counting/counting/counting.page';
import { responseCode } from 'src/app/configurations/responseCode';
import { SelectItemsPage } from '../../selectItems/select-items/select-items.page';

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.page.html',
  styleUrls: ['./inventory-details.page.scss'],
})
export class InventoryDetailsPage implements OnInit {


  inventoryDetails = new Array<Product>();
  items = new Array<Product>();

  inventory = new Inventory();

  itemParam: string;

  scannedData: any;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private alertController: AlertController,
    private barcodeScanner: BarcodeScanner,
  ) { }

  ngOnInit() {
    this.inventory = this.navParams.get('data');
    this.getInventoryDetails(this.inventory.Id);
  }


  scanQR() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;

    }).catch(err => {
      console.log('Error', err);
    });

  }



  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


  getInventoryDetails(id: number) {
    this.inventoryService.getInventoryDetails(id).subscribe((response: Iresponse) => {
      this.inventoryDetails = response.Data;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  async openModalCountingInventory(data?: any) {
    const modal = await this.modalController.create({
      component: CountingPage,
      componentProps: { data: data },
    });

    modal.onDidDismiss().then((param) => {
      if (param.data) {
        this.getInventoryDetails(param.data);
      }
    });

    await modal.present();
  }


  async openModalSelectItems(data?: any) {
    const modal = await this.modalController.create({
      component: SelectItemsPage,
      componentProps: { data: data, currentInventory: this.inventory },
    });

    await modal.present();
  }


  searchItems(param: string) {

    this.inventoryService.getItems(param).subscribe((response: Iresponse) => {
      this.items = response.Data;
      this.itemParam = '';

      if (response.Code === '000') {

        if (this.items.length == 1) {

          this.items[0].InventoryId = this.inventory.Id
          this.openModalCountingInventory(this.items[0]);

        } else {

          this.openModalSelectItems(this.items);

        }

      } else {
        this.showMessage(response.Message, 'danger', 2000);
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  async deleteItemAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el item ?',
      message: 'Los cambios no podran ser revertidos!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',
          handler: () => {

          }
        }, {
          text: 'Sí',
          id: 'confirm-button',
          handler: () => {
            this.deleteItems(id);
          }
        }
      ]
    });

    await alert.present();
  }


  deleteItems(id: number) {
    this.inventoryService.deleteInventoryDetail(id).subscribe((response: Iresponse) => {
      if (response.Code === responseCode.ok) {
        this.showMessage(response.Message, 'success', 2000);
        this.getInventoryDetails(this.inventory.Id)
      } else {
        this.showMessage(response.Message, 'danger', 4000);
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });

  }


  async showMessage(text: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: text,
      color: color,
      duration: duration,
    });
    toast.present();
  }



}

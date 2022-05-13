import { Component, OnInit } from '@angular/core';
import { Inventory, InventoryModel } from 'src/app/models/inventory';
import { Product } from 'src/app/models/product';
import { InventoryService } from './../../../../services/domain/inventory/inventory.service';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CreateOrEditPage } from '../pages/createOrEdit/create-or-edit/create-or-edit.page';
import { iif } from 'rxjs';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { responseCode } from './../../../../configurations/responseCode';
import { InventoryDetailsPage } from '../pages/inventoryDetails/inventory-details/inventory-details.page';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {



  canDoInventory: boolean;

  inventories = new Array<Inventory>();
  inventory = new InventoryModel();
  currentInventory = new Inventory();

  inventoryDetails = new Array<Product>();

  items = new Array<Product>();



  constructor(
    private inventoryService: InventoryService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }


  ngOnInit() {
    this.getAll();
  }


  getAll() {
    this.inventoryService.getAll().subscribe((response: Array<Inventory>) => {
      this.inventories = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  async moreActionSheet(inventoy: Inventory) {

    const actionSheet = await this.actionSheetController.create({
      backdropDismiss: true,
      buttons: [

        {
          text: 'Cancelar',
          icon: 'close',
          handler: () => {
          }
        },

        {
          text: 'Eliminar',
          icon: 'trash',
          handler: () => {
            this.deleteInventoryAlert(inventoy.Id);
          }
        },

        {
          text: 'Editar',
          icon: 'pencil',
          handler: () => {
            this.openModalCreateOrEditInventory(inventoy);
          }
        },

        {
          text: 'Cerrar inventario',
          icon: 'close',
          handler: () => {
            this.CloseInventoryAlert(inventoy.Id);
          }
        },

        {
          text: 'Contar items',
          icon: 'checkmark-circle-outline',
          handler: () => {
            this.openModalInventoryDetails(inventoy);
          }
        },

      ]

    });

    await actionSheet.present();

  }


  async openModalCreateOrEditInventory(data?: any) {
    const modal = await this.modalController.create({
      component: CreateOrEditPage,
      componentProps: { data: data },
    });

    modal.onDidDismiss().then((param) => {
      if (param.data) {
        this.getAll();
      }

    });

    await modal.present();

  }


  async openModalInventoryDetails(data?: any) {
    const modal = await this.modalController.create({
      component: InventoryDetailsPage,
      componentProps: { data: data },
    });

    modal.onDidDismiss().then((param) => {
      if (param.data) {
      }

    });

    await modal.present();

  }


  async deleteInventoryAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el inventario ?',
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
            this.deleteInventory(id);
          }
        }
      ]
    });

    await alert.present();
  }


  deleteInventory(id: number) {
    this.inventoryService.delete(id).subscribe((response: Iresponse) => {
      if (response.Code === responseCode.ok) {
        this.showMessage(response.Message, 'success', 2000);
        this.getAll();
      } else {
        this.showMessage(response.Message, 'danger', 4000);
      }
    },
      error => {
        console.log(JSON.stringify(error));
      });

  }


  async CloseInventoryAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Está seguro que desea cerrar el inventario ?',
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
            this.CloseInventory(id);
          }
        }
      ]
    });

    await alert.present();
  }

  CloseInventory(id: number) {
    this.inventoryService.closedInventory(id).subscribe((response: Iresponse) => {
      if (response.Code === responseCode.ok) {
        this.showMessage(response.Message, 'success', 2000);
        this.getAll();
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

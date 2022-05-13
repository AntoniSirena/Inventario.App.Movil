import { Component, OnInit } from '@angular/core';
import { Inventory, InventoryModel } from 'src/app/models/inventory';
import { Product } from 'src/app/models/product';
import { InventoryService } from './../../../../services/domain/inventory/inventory.service';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CreateOrEditPage } from '../pages/createOrEdit/create-or-edit/create-or-edit.page';


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
            alert('Eliminar');
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
            alert('Cerrar inventario');
          }
        },

        {
          text: 'Contar items',
          icon: 'checkmark-circle-outline',
          handler: () => {
            alert('Contar items');
          }
        },

      ]

    });

    await actionSheet.present();

  }


  async openModalCreateOrEditInventory(data?: any) {
    const modal = await this.modalController.create({
      component: CreateOrEditPage,
      componentProps: {data: data},
    });

    modal.onDidDismiss().then(() => {
      this.getAll();
    })

    await modal.present();

  }

}

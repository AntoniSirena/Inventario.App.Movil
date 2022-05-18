import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavParams, ToastController, AlertController, IonSearchbar } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { Inventory } from 'src/app/models/inventory';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { CountingPage } from '../../counting/counting/counting.page';
import { responseCode } from 'src/app/configurations/responseCode';
import { SelectItemsPage } from '../../selectItems/select-items/select-items.page';
import { PaginationObject } from './../../../../../../models/common/PaginationObject';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.page.html',
  styleUrls: ['./inventory-details.page.scss'],
})
export class InventoryDetailsPage implements OnInit {

  @ViewChild(IonSearchbar) searchParam: IonSearchbar;

  inventoryDetails = new Array<Product>();
  inventoryDetailsPaginated = new PaginationObject();
  items = new Array<Product>();

  inventory = new Inventory();

  itemParam: string;
  currentPageNumber: number;


  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.currentPageNumber = 1;

    this.inventory = this.navParams.get('data');
    this.getInventoryDetails_Paginated(this.inventory.Id, 'neext');
  }


  ionViewWillEnter() {
    this.searchParam.setFocus(); 
  }




  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


  getInventoryDetails(inventoryId: number) {
    this.inventoryService.getInventoryDetails(inventoryId).subscribe((response: Iresponse) => {
      this.inventoryDetails = response.Data;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  getInventoryDetails_Paginated(inventoryId: number, origin: string, refresh: boolean = false) {

    if (origin === 'back') {
      if (this.currentPageNumber > 1) {
        this.currentPageNumber -= 1;
      }
    }

    if (refresh) {
      this.currentPageNumber = 1;
    }

    this.inventoryService.getInventoryDetails_Paginated(inventoryId, this.currentPageNumber).subscribe((response: Iresponse) => {

      if (this.currentPageNumber === 1) {
        this.inventoryDetailsPaginated = response.Data;

        if (response.Data.Records.length === this.inventoryDetailsPaginated.Pagination.PageRow) {
          this.currentPageNumber += 1;
        }

      } else {
        this.inventoryDetailsPaginated.Records = response.Data;

        if (response.Data.length === this.inventoryDetailsPaginated.Pagination.PageRow) {
          this.currentPageNumber += 1;
        }
      }

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

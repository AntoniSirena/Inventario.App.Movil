import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavParams, ToastController, AlertController, IonSearchbar, LoadingController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { Inventory } from 'src/app/models/inventory';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { CountingPage } from '../../counting/counting/counting.page';
import { responseCode } from 'src/app/configurations/responseCode';
import { SelectItemsPage } from '../../selectItems/select-items/select-items.page';
import { PaginationObject } from './../../../../../../models/common/PaginationObject';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.page.html',
  styleUrls: ['./inventory-details.page.scss'],
})
export class InventoryDetailsPage implements OnInit {

  @ViewChild('searchbar') searchbar: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  inventoryDetails = new Array<Product>();
  inventoryDetailsPaginated = new PaginationObject();
  items = new Array<Product>();

  inventory = new Inventory();

  itemParam: string;
  currentPageNumberRequest: number;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,

  ) { }


  ngOnInit() {
    this.currentPageNumberRequest = 1;
    this.inventory = this.navParams.get('data');
    this.getInventoryDetails();
  }


  ionViewWillEnter() {
    this.setFocus_Searchbar();
  }


  setFocus_Searchbar() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1500);
  }


  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


  getInventoryDetails(event?) {

    if (event) {
      event.target.complete();
    }

    if (this.inventoryDetailsPaginated.Records) {
      if (this.inventoryDetailsPaginated.Records.length === this.inventoryDetailsPaginated.Pagination.TotalRecord) {
        return;
      }
    }

    this.inventoryService.getInventoryDetails_Paginated(this.inventory.Id, this.currentPageNumberRequest).subscribe((response: Iresponse) => {

      if (this.currentPageNumberRequest === 1) {
        this.inventoryDetailsPaginated = response.Data;
      } else {
        this.inventoryDetailsPaginated.Records.push(...response.Data);
      }
      this.currentPageNumberRequest += 1;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getInventoryDetailsRefresh() {
    this.inventoryService.getInventoryDetails_Paginated_Refresh(this.inventory.Id, 1, true, this.inventoryDetailsPaginated.Records.length).subscribe((response: Iresponse) => {
      this.inventoryDetailsPaginated.Records = response.Data;
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
        this.setFocus_Searchbar();
        this.getInventoryDetailsRefresh();
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

    this.presentLoading();

    this.inventoryService.getItems(param).subscribe((response: Iresponse) => {
      this.items = response.Data;
      this.itemParam = '';
      this.loadingController.dismiss();

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
        this.loadingController.dismiss();
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
        this.showMessage(response.Message, 'success', 1000);
        this.getInventoryDetailsRefresh();
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


  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      message: 'Cargando...',
    });
    await loading.present();
  }



}

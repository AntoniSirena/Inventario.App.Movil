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
  currentPageNumber: number;

  nextPage: number;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,

  ) { }


  ngOnInit() {
    this.currentPageNumberRequest = 1;
    this.nextPage = 1;
    this.inventory = this.navParams.get('data');
    this.getInventoryDetails_Paginated('next');
    //this.getInventoryDetails_Paginated_InfinityScroll(this.currentPageNumberRequest);
  }


  ionViewWillEnter() {
    this.setFocus_Searchbar();
  }


  setFocus_Searchbar() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1500);
  }


  generateNextPage(orign: string): number {
    if (orign == 'next') {
      this.nextPage += 1;
    }

    return this.nextPage;
  }



  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


  getInventoryDetails_Paginated(origin: string, refresh: boolean = false) {

    //Geration of pages
    if (!refresh) {
      if (origin == 'next') {
        this.nextPage = this.generateNextPage(origin);
        this.currentPageNumberRequest = this.nextPage - 1;
      }

      if (origin == 'back') {
        if (this.currentPageNumber > 1) {
          this.currentPageNumberRequest = this.currentPageNumber - 1;
          this.currentPageNumber -= 1;
          this.nextPage -= 1;
        }
      }
    }

    if (refresh) {
      if (this.currentPageNumberRequest > this.currentPageNumber) {
        this.currentPageNumberRequest -= 1;
      }
    }

    this.inventoryService.getInventoryDetails_Paginated(this.inventory.Id, this.currentPageNumberRequest).subscribe((response: Iresponse) => {

      if (this.currentPageNumberRequest === 1) {
        this.inventoryDetailsPaginated = response.Data;

      } else {
        this.inventoryDetailsPaginated.Records = response.Data;
      }
      if (!refresh) {
        if (origin == 'next') {
          this.currentPageNumberRequest = this.nextPage
          this.currentPageNumber = this.currentPageNumberRequest - 1;
        }
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  getInventoryDetails_Paginated_InfinityScroll(currentPage: number) {

    this.inventoryService.getInventoryDetails_Paginated(this.inventory.Id, currentPage).subscribe((response: Iresponse) => {
      
      if (this.currentPageNumberRequest === 1) {
        this.inventoryDetailsPaginated = response.Data;

      } else {
        this.inventoryDetailsPaginated.Records = response.Data;
      }

      this.nextPage += 1;
      this.currentPageNumberRequest = this.nextPage;

    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  loadData(event) {
    setTimeout(() => {
      event.target.complete();

      this.getInventoryDetails_Paginated_InfinityScroll(this.nextPage);

    }, 500);
  }


  async openModalCountingInventory(data?: any) {
    const modal = await this.modalController.create({
      component: CountingPage,
      componentProps: { data: data },
    });

    modal.onDidDismiss().then((param) => {
      if (param.data) {
        this.setFocus_Searchbar();
        this.getInventoryDetails_Paginated('next', true);
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
        this.getInventoryDetails_Paginated('next');
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

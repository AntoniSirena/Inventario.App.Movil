import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { CountingPage } from '../../counting/counting/counting.page';
import { Inventory } from './../../../../../../models/inventory';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.page.html',
  styleUrls: ['./select-items.page.scss'],
})
export class SelectItemsPage implements OnInit {


  products = new Array<Product>();

  currentInventory = new Inventory();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
  ) { }


  ngOnInit() {
    this.products = this.navParams.get('data');
    this.currentInventory = this.navParams.get('currentInventory');
  }

  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  selectItem(item: Product){
    this.modalController.dismiss();
    item.InventoryId = this.currentInventory.Id;
    this.openModalCountingInventory(item);
  }

  async openModalCountingInventory(data?: any) {
    const modal = await this.modalController.create({
      component: CountingPage,
      componentProps: { data: data },
    });

    await modal.present();
  }
}

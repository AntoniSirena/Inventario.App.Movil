import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { Inventory } from 'src/app/models/inventory';
import { Iresponse } from 'src/app/interfaces/Iresponse';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.page.html',
  styleUrls: ['./inventory-details.page.scss'],
})
export class InventoryDetailsPage implements OnInit {


  inventoryDetails = new Array<Product>();
  inventory = new Inventory();

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.inventory = this.navParams.get('data');
    this.getInventoryDetails(this.inventory.Id);
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



}

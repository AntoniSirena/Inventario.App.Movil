import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSearchbar, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { Section, Tariff } from 'src/app/models/inventory';
import { Product } from 'src/app/models/product';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { responseCode } from './../../../../../../configurations/responseCode';

@Component({
  selector: 'app-counting',
  templateUrl: './counting.page.html',
  styleUrls: ['./counting.page.scss'],
})
export class CountingPage implements OnInit {

  @ViewChild('quantityInput') quantityInput: IonSearchbar;

  countingForm: FormGroup;

  product = new Product();

  sections = new Array<Section>();
  tariffs = new Array<Tariff>();


  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
  ) { }


  ngOnInit() {
    this.getSection();
    this.getTariff();
    this.product = this.navParams.get('data');
    this.initCountingFrom();
    this.setFocus_QuantityInput();
  }


  setFocus_QuantityInput(){
    setTimeout(() => {
      this.quantityInput.setFocus(); 
    }, 500);
  }

  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


  getSection() {
    this.inventoryService.getSection().subscribe((response: Array<Section>) => {
      this.sections = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }

  getTariff() {
    this.inventoryService.getTariff().subscribe((response: Array<Tariff>) => {
      this.tariffs = response;
    },
      error => {
        console.log(JSON.stringify(error));
      });
  }


  //save item
  saveItem(form: any) {

    if (!form.quantity) {
      this.showMessage('La cantidad debe ser mayor a 0', 'warning', 2000);
      return;
    }

    const data: Product = {
      Id: this.product.Id,
      Description: null,
      ExternalCode: null,
      BarCode: null,
      OldCost: 0,
      OldPrice: 0,
      Cost: form.cost,
      Price: form.price,
      Quantity: form.quantity,
      InventoryId: this.product.InventoryId,
      InventoryDetailId: this.product.InventoryDetailId,
      UserName: null,
      SectionId: form.sectionId,
      TariffId: form.tariffId,
      SectionDescription: null,
      TariffDescription: null,
    };

    this.inventoryService.saveItem(data).subscribe((response: Iresponse) => {
      if (response.Code === responseCode.ok) {
        this.showMessage(response.Message, 'success', 1000);
        this.modalController.dismiss(data.InventoryId);
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


  initCountingFrom() {
    this.countingForm = this.form.group({
      cost: [this.product.Cost],
      price: [this.product.Price],
      quantity: ['', Validators.required],
      sectionId: [this.product.SectionId],
      tariffId: [this.product.TariffId],
    });
  }
  


}

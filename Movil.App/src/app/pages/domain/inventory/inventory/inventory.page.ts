import { Component, OnInit } from '@angular/core';
import { Inventory, InventoryModel } from 'src/app/models/inventory';
import { Product } from 'src/app/models/product';
import { InventoryService } from './../../../../services/domain/inventory/inventory.service';

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



}

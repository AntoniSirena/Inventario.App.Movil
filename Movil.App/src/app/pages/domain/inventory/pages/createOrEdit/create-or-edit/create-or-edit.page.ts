import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { responseCode } from 'src/app/configurations/responseCode';
import { Iinventory } from 'src/app/interfaces/iinventory';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { InventoryService } from 'src/app/services/domain/inventory/inventory.service';
import { Inventory, InventoryModel } from 'src/app/models/inventory';

@Component({
  selector: 'app-create-or-edit',
  templateUrl: './create-or-edit.page.html',
  styleUrls: ['./create-or-edit.page.scss'],
})
export class CreateOrEditPage implements OnInit {

  createOrEditForm: FormGroup;

  titleHeader: string;
  currentInventory: Inventory;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private form: FormBuilder,
    private inventoryService: InventoryService,
    private toastController: ToastController,
  ) {

  }



  ngOnInit() {

    this.initCreateOrEditFrom();

    this.currentInventory = this.navParams.get('data');

    if (this.currentInventory?.Id) {
      this.titleHeader = "Editando inventario";

      this.createOrEditForm = this.form.group({
        Id: [this.currentInventory.Id],
        description: [this.currentInventory.Description, Validators.required],
      });

    } else {
      this.titleHeader = "Creando inventario";
    }

  }


  closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  createOrEdit(form: any) {

    if (form?.Id) {

      this.inventoryService.getById(form?.Id).subscribe((response: InventoryModel) => {

        const data: Iinventory = {
          Id: response.Id,
          Description: form.description,
          StatusId: response.StatusId,
          UserId: response.UserId,
          OpenDate: response.OpenDate,
          ClosedDate: response.ClosedDate,
          CreatorUserId: response.CreatorUserId,
          CreationTime: response.CreationTime,
          LastModifierUserId: response.LastModifierUserId,
          LastModificationTime: response.LastModificationTime,
          DeleterUserId: response.DeleterUserId,
          DeletionTime: response.DeletionTime,
          IsActive: response.IsActive,
          IsDeleted: response.IsDeleted,
        };
  
        this.inventoryService.update(data).subscribe((response: Iresponse) => {

          if (response.Code === responseCode.ok) {
            this.showMessage(response.Message, 'success', 2000);
            this.modalController.dismiss(true);
          } else {
            this.showMessage(response.Message, 'danger', 4000);
          }

        },
          error => {
            console.log(JSON.stringify(error));
          });

      },
        error => {
          console.log(JSON.stringify(error));
        });

    } 
    else {
      const data: Iinventory = {
        Id: 0,
        Description: form.description,
        StatusId: 0,
        UserId: 0,
        OpenDate: null,
        ClosedDate: null,
        CreatorUserId: null,
        CreationTime: null,
        LastModifierUserId: null,
        LastModificationTime: null,
        DeleterUserId: null,
        DeletionTime: null,
        IsActive: true,
        IsDeleted: false
      };

      this.inventoryService.create(data).subscribe((response: Iresponse) => {
        if (response.Code === responseCode.ok) {
          this.showMessage(response.Message, 'success', 2000);
          this.modalController.dismiss(true);
        } else {
          this.showMessage(response.Message, 'danger', 4000);
        }
      },
        error => {
          console.log(JSON.stringify(error));
        });
    }

  }


  initCreateOrEditFrom() {
    this.createOrEditForm = this.form.group({
      Id: [0],
      description: ['', Validators.required],
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

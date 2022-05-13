import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateOrEditPageRoutingModule } from './create-or-edit-routing.module';

import { CreateOrEditPage } from './create-or-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateOrEditPageRoutingModule
  ],
  declarations: [CreateOrEditPage]
})
export class CreateOrEditPageModule {}

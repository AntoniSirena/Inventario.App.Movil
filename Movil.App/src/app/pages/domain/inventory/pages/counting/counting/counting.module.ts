import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountingPageRoutingModule } from './counting-routing.module';

import { CountingPage } from './counting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CountingPageRoutingModule
  ],
  declarations: [CountingPage]
})
export class CountingPageModule {}

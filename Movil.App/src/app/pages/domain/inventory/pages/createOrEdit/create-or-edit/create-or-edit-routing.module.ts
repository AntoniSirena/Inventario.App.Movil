import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateOrEditPage } from './create-or-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CreateOrEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateOrEditPageRoutingModule {}

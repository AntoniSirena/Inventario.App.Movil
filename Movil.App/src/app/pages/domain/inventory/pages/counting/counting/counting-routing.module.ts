import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountingPage } from './counting.page';

const routes: Routes = [
  {
    path: '',
    component: CountingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountingPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/authorization/authorization-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'default',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/default/default/default.module').then( m => m.DefaultPageModule)
  },
  {
    path: 'close-session',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/closeSession/close-session/close-session.module').then( m => m.CloseSessionPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/domain/inventory/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'create-or-edit',
    loadChildren: () => import('./pages/domain/inventory/pages/createOrEdit/create-or-edit/create-or-edit.module').then( m => m.CreateOrEditPageModule)
  },  {
    path: 'inventory-details',
    loadChildren: () => import('./pages/domain/inventory/pages/inventoryDetails/inventory-details/inventory-details.module').then( m => m.InventoryDetailsPageModule)
  },
  {
    path: 'counting',
    loadChildren: () => import('./pages/domain/inventory/pages/counting/counting/counting.module').then( m => m.CountingPageModule)
  }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

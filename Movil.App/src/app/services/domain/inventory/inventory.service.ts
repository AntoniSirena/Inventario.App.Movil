import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iinventory } from 'src/app/interfaces/iinventory';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  coreURL;

  constructor(private httpClient: HttpClient) {
    this.coreURL = environment.coreURL;
  }


  getAll(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/inventory/GetAll');
  }

  getById(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetById?Id=${id}`);
  }

  getItems(input: string): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetItems?input=${input}`);
  }

  getSection(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/inventory/GetSection');
  }

  getTariff(): Observable<object> {
    return this.httpClient.get(this.coreURL + 'api/inventory/GetTariff');
  }

  getInventoryDetails(inventoryId: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetInventoryDetails?inventoryId=${inventoryId}`);
  }

  getInventoryDetails_Paginated(inventoryId: number, pageNumber: number = 1): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GetInventoryDetails_Paginated?inventoryId=${inventoryId}&pageNumber=${pageNumber}`);
  }

  closedInventory(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/ClosedInventory?id=${id}`);
  }

  generateInventoryExcel(id: number): Observable<object> {
    return this.httpClient.get(this.coreURL + `api/inventory/GenerateInventoryExcel?Id=${id}`);
  }

  saveItem(request: Product) {
    let data = JSON.stringify(request);
    return this.httpClient.post(`${this.coreURL}api/inventory/SaveItem`, data);
  }


  create(request: Iinventory) {
    let data = JSON.stringify(request);
    return this.httpClient.post(`${this.coreURL}api/inventory/Create`, data);
  }

  update(request: Iinventory) {
    let data = JSON.stringify(request);
    return this.httpClient.put(`${this.coreURL}api/inventory/Update`, data);
  }

  delete(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + `api/inventory/Delete?id=${id}`);
  }

  deleteInventoryDetail(id: number): Observable<object> {
    return this.httpClient.delete(this.coreURL + `api/inventory/DeleteInventoryDetail?id=${id}`);
  }

}

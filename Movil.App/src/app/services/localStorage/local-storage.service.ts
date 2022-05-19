import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  addSectionData(data: any) {
    localStorage.setItem('sectionData', JSON.stringify(data));
    localStorage.setItem('token', JSON.stringify(data.Profile.User.Token));
    localStorage.setItem('refreshToken', JSON.stringify(data.Profile.User.RefreshToken));
  }

}

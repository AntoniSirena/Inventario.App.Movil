import { Injectable } from '@angular/core';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() {

  }

  getUserProfile(): Profile {
    let data = JSON.parse(localStorage.getItem('sectionData'));
    let profile: Profile = data?.Profile;
    return profile;
  }

  getUserToken(): string {
    let token = JSON.parse(localStorage.getItem('token'));
    return token;
  }

  getUserRefreshToken(): string {
    let refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    return refreshToken;
  }

}

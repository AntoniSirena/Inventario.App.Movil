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
    let data = JSON.parse(localStorage.getItem('sectionData'));
    let token: string;

    if(data){
      let profile: Profile = data?.Profile;
      token = profile.User.Token;
    }

    return token;
  }

}

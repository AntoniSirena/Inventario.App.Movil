import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/profile';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { RedirectService } from 'src/app/services/redirect/redirect.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  coreURL = environment.coreURL;
  img_Width = 140
  img_height = 130;

  profile: Profile;
  
  constructor(
    private profileService: ProfileService,
    private redirectService: RedirectService,
  ) { }

  ngOnInit() {
    this.profile = this.profileService.getUserProfile();
  }


  logOut(){
    this.redirectService.logout();
  }

}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { responseCode } from 'src/app/configurations/responseCode';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { Profile } from 'src/app/models/profile';
import { AuthorizationService } from '../authorization/authorization.service';
import { ProfileService } from '../profile/profile.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {


  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private toastController: ToastController,
  ) { 

  }


  defaultPage(){
    this.router.navigate(['default']);
  }


  refreshToken() {

    this.authorizationService.refreshToken(this.profileService.getUserRefreshToken()).subscribe((response: Iresponse) => {
      if (response.Code == responseCode.ok) {
        localStorage.setItem('token', JSON.stringify(response.Data.token));
        localStorage.setItem('refreshToken', JSON.stringify(response.Data.refreshToken));
      } else {
        this.showMessage(response.Message, 'danger', 2000);
        this.router.navigate(['login']).then(() => {
          location.reload();
        });
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });

  }


  logout() {

    this.router.navigate(['login']).then(() => {
      let profile: Profile = this.profileService.getUserProfile()
      localStorage.clear();

      if (profile.User.Id) {
        this.authorizationService.logOut(profile.User.Id.toString()).subscribe((response: any) => {
        },
          error => {
            console.log(JSON.stringify(error));
          });
      }
    });

  }


  error400(message: string){
    this.showMessage(message, 'danger', 4000);
  }

  error404(message: string){
    this.showMessage(message, 'danger', 4000);
  }

  error500(){
    this.showMessage('Estimado usuario ha ocurrido un error interno', 'danger', 5000);
  }


  async showMessage(text: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: text,
      color: color,
      duration: duration,
    });
    toast.present();
  }


}

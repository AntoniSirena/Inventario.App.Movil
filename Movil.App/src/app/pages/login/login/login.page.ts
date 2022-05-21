import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ToastController } from '@ionic/angular';
import { Ilogin } from 'src/app/interfaces/Ilogin';
import { Iresponse } from 'src/app/interfaces/Iresponse';
import { Profile } from 'src/app/models/profile';
import { AuthorizationService } from 'src/app/services/authorization/authorization.service';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { RedirectService } from 'src/app/services/redirect/redirect.service';
import { channel } from './../../../configurations/channel';
import { responseCode } from './../../../configurations/responseCode';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;


  constructor(
    private form: FormBuilder,
    private authorizationService: AuthorizationService,
    private localStorageService: LocalStorageService,
    private redirectService: RedirectService,
    private toastController: ToastController,
    public menuCtrl: MenuController,
  ) { }


  ngOnInit() {
    this.menuCtrl.enable(false);
    this.initLoginform();
  }

  login(form: any) {

    const data: Ilogin = {
      UserName: form.userName,
      Password: form.password,
      EmailAddress: '',
      SecurityCode: '',
      Token2AF: '',
      RefreshToken: false,
      Channel: channel.movil,
    };

    this.authorizationService.authenticate(data).subscribe((response: Iresponse) => {

      if (response.Code == responseCode.ok) {
        this.menuCtrl.enable(true);

        this.localStorageService.addSectionData(response.Data);
        this.redirectService.defaultPage();
      } else {
        this.showMessage(response.Message);
      }

    },
      error => {
        console.log(JSON.stringify(error));
      });

  }

  async showMessage(text: string) {
    const toast = await this.toastController.create({
      message: text,
      color: 'danger',
      duration: 3000
    });
    toast.present();
  }


  initLoginform() {
    this.loginForm = this.form.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NetworkConnectionService } from '../networkConnection/network-connection.service';
import { ProfileService } from '../profile/profile.service';
import { RedirectService } from '../redirect/redirect.service';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  token: string;
  coreURL: string;

  constructor(
    private networkConnectionService: NetworkConnectionService,
    private profileService: ProfileService,
    private redirectService: RedirectService,
  ) {
    this.coreURL = environment.coreURL;
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token = this.profileService.getUserToken() || '';

    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');

    if (req.url.match("login")) {

    } else {
      headers = headers.append('Authorization', `${this.token}`);
    }

    this.networkConnectionService.checkoutNetworkStatus();

    const reqclone = req.clone({
      headers
    });

    return next.handle(reqclone).pipe(
      tap((resp: HttpEvent<any>) => {
        if (resp instanceof HttpResponse) {

        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {

          if (error.status === 301 || error.status === 302 || error.status === 303) {
            location.href = error.error;
          }
          if (error.status === 400) {
            this.redirectService.error400(error.error.Message);
          }
          if (error.status === 401) {
            this.redirectService.refreshToken();
          }
          if (error.status === 404) {
            this.redirectService.error404(error.error.Message);
          }
          if (error.status === 500) {
            this.redirectService.error500();
          }

        }
      })
    );

  }


}

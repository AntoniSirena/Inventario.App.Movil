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


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  token: string;
  coreURL: string;

  constructor(
    private networkConnectionService: NetworkConnectionService,
    private profileService: ProfileService,
  ) {
    this.coreURL = environment.coreURL;
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token = this.profileService.getUserToken() || '';

    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');
    headers = headers.append('Access-Control-Allow-Headers', '*');

    if (req.url.match("login")) {

    } else {
      headers = headers.append('Authorization', `${this.token}`);
    }

    this.networkConnectionService.getNetworkStatus();

    const reqclone = req.clone({
      headers
    });

    return next.handle(reqclone).pipe(
      tap((resp: HttpEvent<any>) => {
        if (resp instanceof HttpResponse) {

        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {

        }
      })
    );

  }


}

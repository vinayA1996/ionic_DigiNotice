import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdBannerService {

  constructor( private authService: AuthenticationService,
    public appConfig: AppConfig,
    public http: HttpClient) { }
  GetAdBannerListByImageType(){
    var url = this.appConfig.getApiPath("AdBanners", "GetAdBannerListByImageType",[1]);
    return this.http.get(url);
  }
}

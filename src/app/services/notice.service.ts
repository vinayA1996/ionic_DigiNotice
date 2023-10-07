import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(public http: HttpClient,
    public appConfig: AppConfig,) { }

  getNoticeType() {
    var url = this.appConfig.getApiPath('Master', 'GetNoticeType');
    return this.http.get(url);
  }
  getStates() {
    var url = this.appConfig.getApiPath('Lookup', 'GetState');
   return this.http.get(url);
  }
  getCities(stateId: number) {
    // var url = this.appConfig.getApiPath("Lookup", "GetCity")+"?state_id="+72;
    var url = this.appConfig.getApiPath('Lookup', 'GetCity', [stateId]);
    return this.http.get(url);
  }
}

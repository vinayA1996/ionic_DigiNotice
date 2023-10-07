import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MappingService } from 'src/app/services/mapping.service';
import { AppConfig } from 'src/app/services/config.service';

declare var $;
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class SharedModelService {

  constructor(
    private http: HttpClient,
    private ms: MappingService,
    public appConfig: AppConfig
  ) {
    this.init();
  }

  isBackEnd: boolean = false;

  isAuthenticated: boolean = false;

  init() {
    //Init
  }

  matchedNoticeCount: number = 0;
  getMatchedNoticeCount(userId:string) {
    var url = this.appConfig.getApiPath("Notice", "GetMatchedNoticeCount",[userId]);
    return this.http.get(url);
  }

  getTabsInfo() {
    return this.http.get('api path')
  }

  validateObjectProperties(objName: any) {
    let NA = 'N/A';
    for (var property in objName) {
      if (objName.hasOwnProperty(property)) {
        if (objName[property] == null) {
          objName[property] = '';
        }
      }
    }
  }

  showMessage(options) {
    toastr[options.type](options.message);
  }

  // profileInfo: ProfileInfo = new ProfileInfo();
  // isProfileLoaded: boolean = false;

  downloadFile(url, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
    xhr.setRequestHeader('cache-control', 'max-age=0');
    xhr.setRequestHeader('expires', '0');
    xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
    xhr.setRequestHeader('pragma', 'no-cache');
    xhr.onload = function () {
      var urlCreator = window.URL || window["webkitURL"];
      var imageUrl = urlCreator.createObjectURL(this["response"]);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    }
    xhr.send();
  }

  lettersOnly(event): boolean {
    let patt = /^([a-zA-Z])$/;
    let result = patt.test(event.key);
    if (!/[a-z]/.test(event.key))
      return result;
    else {
      // toastr.error("Only letters are allowed", "Error");
      return result;
    }
  }

}
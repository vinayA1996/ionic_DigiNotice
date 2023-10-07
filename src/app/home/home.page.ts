import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AppConfig } from '../services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AddAdBannerWebModel, BannerImageModel } from '../models/AdBanner';
import { AdBannerService } from '../services/ad-banner.service';
import { NoticeService } from '../services/notice.service';

import { State } from '../models/model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('move', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => left', [
        style({ transform: 'translateX(100%)' }),
        animate(20000),
      ]),
      transition('left => void', [
        animate(200, style({ transform: 'translateX(0)' })),
      ]),
      transition('void => right', [
        style({ transform: 'translateX(-100%)' }),
        animate(20000),
      ]),
      transition('right => void', [
        animate(20000, style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class HomePage implements OnInit {
  imagesUrl: Array<AddAdBannerWebModel> = []; // Use AddAdBannerWebModel type
  bannerImageModelList: Array<BannerImageModel> = []; // Use BannerImageModel type
  bannerImageModel: BannerImageModel = new BannerImageModel();
  images: any[];
  autoRotate = true;
  autoRotateAfter = 2000;
  autoRotateRight = true;
  startDate: string;
  safeUrls: Array<string> = []; // Use string type for safeUrls
  AdUrls: Array<string> = []; // Use string type for AdUrls
  imageUrls: Array<BannerImageModel> = []; // Use BannerImageModel type for imageUrls
  state = 'void';
  disableSliderButtons = false;
  subscription: Subscription;

  NoticeType: any = [];
  stateList: State[] = [];
  tabs: string = 'Universal';

  constructor(
    public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
    private adBannerService: AdBannerService,
    private notice: NoticeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.setImage();
    
  }

  //---------------------------adds image --------------------------------
  setImage() {
    this.adBannerService
      .GetAdBannerListByImageType()
      .subscribe((adBannerModel: Array<AddAdBannerWebModel>) => {
        adBannerModel.forEach((adBanner) => {
          var imgPath = adBanner.imagePath;
          this.imagesUrl.push(adBanner);
        });

        this.imagesUrl.forEach((element) => {
          const safeUrl = this.sanitizer.sanitize(
            SecurityContext.URL,
            element.imagePath
          );
          const AdUrl = this.sanitizer.sanitize(
            SecurityContext.NONE,
            element.adUrl
          );
          this.bannerImageModel.adUrl = AdUrl;
          this.bannerImageModel.imagePath = safeUrl;
          var model = { adUrl: AdUrl, imagePath: safeUrl };
          this.bannerImageModelList.push(model);
        });

        this.imageUrls = this.bannerImageModelList;

        if (this.autoRotate) {
          const source = interval(this.autoRotateAfter);
          this.subscription = source.subscribe(() =>
            this.autoRotateRight ? this.moveLeft() : this.moveRight()
          );
        }
      });
  }

  imageRotate(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }

  moveLeft() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = 'right';
    this.imageRotate(this.imageUrls, true);
  }

  moveRight() {
    if (this.disableSliderButtons) {
      return;
    }
    this.state = 'left';
    this.imageRotate(this.imageUrls, false);
  }

  onFinish($event) {
    this.state = 'void';
    this.disableSliderButtons = false;
  }

  onStart($event) {
    this.disableSliderButtons = true;
  }

  openImageUrl(adUrl: string) {
    window.open(adUrl, '_blank');
  }
}

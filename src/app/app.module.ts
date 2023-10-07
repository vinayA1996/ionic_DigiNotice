import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './common-component/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './common-component/signup/signup.component';
import { DgnoticeTermsComponent } from './common-component/signup/dgnotice-terms/dgnotice-terms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './custom-headers.service';

@NgModule({
  declarations: [AppComponent,LoginComponent,DefaultLayoutComponent,SignupComponent,DgnoticeTermsComponent],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    CommonModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
     ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true     
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}

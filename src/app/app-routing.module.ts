import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common-component/login/login.component';
import { SignupComponent } from './common-component/signup/signup.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent,data: {title: 'Login Page'}
  },
  {
    path: 'signup', component: SignupComponent,data: {title: 'Sign Up'}
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

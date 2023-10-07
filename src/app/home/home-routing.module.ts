import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { AssetManagerComponent } from './asset-manager/asset-manager.component';
import { MatchedNoticesComponent } from './matched-notices/matched-notices.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ShareComponent } from './share/share.component';
import { HelpComponent } from './help/help.component';
import { AboutAppComponent } from './about-app/about-app.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  { path: 'home', component: HomePage},
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'bookmark', component: BookmarkComponent },
  { path: 'asset-manager', component: AssetManagerComponent},
  { path: 'matched-notices', component: MatchedNoticesComponent},
  { path: 'notification-settings', component: NotificationSettingsComponent},
  { path: 'share', component: ShareComponent},
  { path: 'help', component: HelpComponent},
  { path: 'about-app', component: AboutAppComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

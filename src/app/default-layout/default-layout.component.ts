import { AccountService } from 'src/app/services/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuController } from '@ionic/angular';
import { User } from '../models/User';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  activeMenuItem: string = '';
  user: User;
  profilePhoto:string='';
  constructor(
    public authService: AuthenticationService,
    public loadingController: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private accountServise: AccountService
  ) {}

  ngOnInit(): void {
    this.updateActiveMenuItem();
    this.accountServise.getUserProfile().subscribe((res: User) => {
      this.user = res;
     this.profilePhoto=res.ProfileImage;
    });
  }
  updateActiveMenuItem(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const urlSegments = urlTree.root.children['primary']?.segments;

    if (urlSegments && urlSegments.length > 0) {
      this.activeMenuItem = urlSegments[0].path;
    }
  }
  closeMenu() {
    this.menuCtrl.close('myMenu');
  }

  onSignOut() {
    this.authService.onLogOut();
    this.router.navigate(['/login']);
  }
}

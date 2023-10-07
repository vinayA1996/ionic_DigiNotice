import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from '../../models/account.model';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController } from '@ionic/angular';
declare var toastr;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginModel: LoginModel;
  public innerWidth: any;
  isShowDownloadLink: boolean = false;
  loginForm: FormGroup;
  otpForm: FormGroup;
  formToggle: string = "SendOTP";
  // isOtp: boolean = true;
  isShowLoader: boolean = false;
  loading: HTMLIonLoadingElement;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private router: Router,
    public loadingController: LoadingController
  ) { 
    this.formToggle= "SendOTP";
  }

  ngOnInit() {
    this.loginModel = new LoginModel();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.otpForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });

    setTimeout(() => { localStorage.removeItem("SessionOTP") }, 600);
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'OTP will be sent on your mobile number',
      spinner:"lines" 
    });
    await this.loading.present();
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please Wait',
      spinner:"bubbles" 
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
  validateForm(loginForm: FormGroup) {
    if (loginForm.controls.password.hasError("required"))
      toastr.error("Password is Required.", "Error");
    if (loginForm.controls.email.hasError("required"))
      toastr.error("Username is Required.", "Error");
    if (loginForm.controls.email.hasError("email"))
      toastr.error("Invalid Email Address.", "Error");
  }

  ChangeLoginType() {

    if (this.formToggle == "SendOTP") {
      this.formToggle = "EmailPassword";
    }
    else {
      this.formToggle = "SendOTP";
    }
  }

  saveContact() {
  
  }

  onSubmit() {

    if (this.loginForm.status == 'VALID') {
      // this.loginModel.grant_type = "password";
      // this.loginModel.email = this.loginForm.controls.email.value;
      // this.loginModel.password = this.loginForm.controls.password.value; 
      this.loginModel={
        email:this.loginForm.controls.email.value,
        password:this.loginForm.controls.password.value,
        grant_type:'password',
        EncryptedOTP:'',
        otp:''
      }
      this.loginAccount(this.loginModel);
    } else {
      this.validateForm(this.loginForm);
    }
  }



  
  sendOtp() {

    this.presentLoading();
    this.loginModel.email = this.otpForm.controls.email.value;
    this.accountService.sendOtp(this.loginModel).subscribe((res: any) => {
      if (res != "not valid user") {
        localStorage.setItem("SessionOTP", res);
        this.dismissLoading();
        this.formToggle = "VerifyOTP";
        // toastr.warning('OTP Sent to Your Registered Number & Email Successfully!', "Success");
      } else if (res == "not valid user") {
        this.dismissLoading();
        // toastr.warning('User is Not Registered. Please Sign Up!', "Warning");
      }
    },
      error => {
        this.dismissLoading();
        toastr.error("Something went wrong.. please try again", "Error");
      });
  }

  goToSignUp() {
    this.router.navigate(['./signup']);
  }

  verifyOtp() {
    this.showLoading();
    if (localStorage.getItem("SessionOTP") != null) {
      this.loginModel.EncryptedOTP = localStorage.getItem("SessionOTP");
      this.accountService.verifyOtp(this.loginModel).subscribe((res: any) => {
        if (res == "Valid") {
          this.dismissLoading();
          // toastr.success('OTP Verified. Wait For Login!', "Success");
          this.loginModel.password = "OTP";
          this.loginAccount(this.loginModel);
        } else if (res == "Invalid") {
          this.dismissLoading();
          toastr.warning('OTP is Invalid. Please Insert Correct OTP!', "Warning");
        }
      },
        error => {
          this.dismissLoading();
          toastr.error("Something went wrong.. please try again", "Error");
        });
    } else {
      this.dismissLoading();
      toastr.warning('Your Session is Expired!', "Warning");
    }
  }

  onResetOTP() {
    this.sendOtp();
  }

  loginAccount(loginModel: LoginModel) {
    this.showLoading();

    this.authService.login(loginModel.email.trim(), loginModel.password, location.origin)
      .subscribe((data: any) => {
        if (data) {
        this.authService.onLogIn(data);
        }
        this.dismissLoading();
      },
        error => {
          this.dismissLoading();
          toastr.error("The User Name or Password is Incorrect", "Error");
        });
  }
  ForgetPassword() {

  }
}

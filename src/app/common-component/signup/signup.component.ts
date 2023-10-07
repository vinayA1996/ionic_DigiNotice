import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpModel, LoginModel } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharedModelService } from 'src/app/services/sharedmodel.service';

import * as $ from 'jquery';
import { AnimationController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {

 registrationForm: FormGroup;

  emailInvalidError: boolean;
  firstNameInvalidError: boolean;
  lastNameInvalidError: boolean;
  phoneInvalidError: boolean;
  pwdInvalidError: boolean;
  pwdLenghtError: boolean;
  confrimPwdError: boolean;
  isValid: boolean;
  loading: HTMLIonLoadingElement;
  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    public sharedModel: SharedModelService,
    private authService: AuthenticationService,
    private animationCtrl: AnimationController,
    public loadingController: LoadingController,
    private toastController: ToastController
  ) {
   
  }
  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
  phoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  pwd = /^.{6,8}$/;
  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(this.phoneNumber)]],
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      optNumber: ['']
    }, { validator: this.MustMatch('password', 'confirmPassword') });

    $("body").addClass('login');
    $("#signup-container").on("keypress", 'input#TxtPhoneNumber',(event:any) => {
      if (isNaN(event.key)) {
        event.preventDefault();
        return false;
      }
      else
      {
        return true;
      }
    });
  }

  async toaster(position:any,color:any,message:any){
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      color:color
    });
    toast.present();
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


  ngOnDestroy() {
    $("body").removeClass('login');
  }


  showPassword:Boolean=false;
  togglePasswordVisibility() {
    
    this.showPassword = !this.showPassword;
  }

  MustMatch(controlName: string, matchingControlName: string) {

    return (registrationForm: FormGroup) => {
      const control = registrationForm.controls['password'];
      const matchingControl = registrationForm.controls['confirmPassword'];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);

      }
    }
  }



  focusOutName(name): boolean {
    
    if (name == "") {
      return false;
    }
    else if (name.length >= 2 && name.length <= 20) {
      return false;
    }
    else {
      this.isValid = true;
      return true;
    }
  }

  focusOutFirstName(name: string) {
  
    this.firstNameInvalidError = this.focusOutName(name);
  }
  focusOutLastName(name: string) {
   
    this.lastNameInvalidError = this.focusOutName(name);
  }

  focusOutEmail(email: string) {
   
    if (email != "") {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let result = re.test(email);
      if (result)
        this.emailInvalidError = false;
      else
        this.emailInvalidError = true;
    }
    else
      this.emailInvalidError = false;
  }

  focusOutPhone(phone) {
   
    if (phone == "") {
      this.phoneInvalidError = false;
    }
    else if (phone.length == 10) {
      this.phoneInvalidError = false;
    }
    else
      this.phoneInvalidError = true;
  }
  focusOutPassword(pwd) {

    if (pwd != "") {
      if (!/[a-z]/.test(pwd) && pwd.length >= 6)
        this.pwdInvalidError = false;
      else
        this.pwdInvalidError = true;
    }
    else {
      this.pwdInvalidError = false;
    }

  }
  focusOutConfirmPassword(pwd, confirmPwd) {
   
    if (pwd.match(confirmPwd)) {
      this.confrimPwdError = false;
    } else {
      this.confrimPwdError = true;
    }
  }

  validateForm(registrationForm: FormGroup) {
    let isValid: boolean = true;
    if (registrationForm.controls['password'].hasError("required") || registrationForm.controls['confirmPassword'].hasError("required")) {
      this.toaster("top","danger","Password and confirm password required.");
      isValid = false;
    }
    return isValid;
  }

  isShowLoader: boolean = false;
  signUpModel: SignUpModel = new SignUpModel();

  Submit() {

    let isValid: boolean = this.validateForm(this.registrationForm);
    if (isValid == true)
      if (this.registrationForm.status == 'VALID') {
        this.signUpModel = this.registrationForm.value;
        this.signUpModel.role = "User";
        this.registerAccount(this.signUpModel);
      }

      return false;
  }

  registerAccount(registrationForm: SignUpModel) {
    this.showLoading();

    var url = this.accountService.apiUrl + 'Account/Register';
    $.ajax({
      type: "POST",
      url: url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: $.param(registrationForm),
    }).done((resp) => {     
      
      if (resp.status=='Success') {
        
        this.toaster("top","success",resp.message);
        let loginModel: LoginModel = new LoginModel();
        loginModel.email = registrationForm.email;
        loginModel.password = registrationForm.password;
       
        this.goToLogin();
        this.dismissLoading();
       
      } else {
        this.dismissLoading();
        this.toaster("top","danger",resp.message);
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      this.toaster("top","danger",textStatus);
      this.dismissLoading();
    });
  }

  goToLogin() {
    
    this.router.navigate(['./login']);
  }

  isAgreedToTerms: boolean = false;
  onAgreedToTerms() {

    
    this.isAgreedToTerms = !this.isAgreedToTerms;
  }



}

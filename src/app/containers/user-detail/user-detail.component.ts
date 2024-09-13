import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/userModel';
import { FirebaseUserService } from 'src/app/services/firebase-user-service/firebase-user.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  public loading: any;
  userForm: FormGroup;
  storage: any;
  storageUser: any;
  user: User;
  completeUser: any;
  completeUserJosn: any;

  constructor(private router: Router, 
              private  authService: AuthService, 
              private fb: FormBuilder, 
              private firebaseUser: FirebaseUserService) { 
                this.userForm = this.fb.group({
                  firstName: ['', Validators.required],
                  lastName: ['', Validators.required],
                  phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
                  gender: ['', Validators.required],
                  age: ['', Validators.required]
                });
              }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('user')!);
    var data  = JSON.parse(localStorage.getItem('completeUser')!);
    if(user != null && (data === null || data.displayName === null || data.displayName === '')) {
      this.router.navigate(['continue-signup']);
    }
    this.completeUser = localStorage.getItem('completeUser');
    this.completeUserJosn = JSON.parse(this.completeUser);
    this.updateFormData();
  }


  updateFormData(): void {
    this.userForm.controls['firstName'].patchValue(this?.completeUserJosn?.displayName);
    this?.completeUserJosn?.displayName != null ?  this.userForm.controls['firstName'].disable() : null;
    this.userForm.controls['lastName'].patchValue(this?.completeUserJosn?.surName);
    this?.completeUserJosn?.surName != null ?  this.userForm.controls['lastName'].disable() : null;
    this?.completeUserJosn?.phone != null ? this.userForm.controls['phone'].patchValue('('+ (this?.completeUserJosn?.ddd  + ') ' + this.completeUserJosn?.phone)): null;
    this?.completeUserJosn?.phone != null ?  this.userForm.controls['phone'].disable() : null;
    this.userForm.controls['gender'].patchValue(this?.completeUserJosn?.gender);
    this?.completeUserJosn?.gender != null ?  this.userForm.controls['gender'].disable() : null;
  }


  logout() {
    this.authService.SignOut();
  }

  onSubmit(): void {
  }

}

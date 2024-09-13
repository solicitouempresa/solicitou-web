import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseUserService } from "../../services/firebase-user-service/firebase-user.service";
import { User } from "src/app/models/userModel";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/user/auth.service";

@Component({
  selector: 'app-continue-signup',
  templateUrl: './continue-signup.component.html',
  styleUrls: ['./continue-signup.component.scss']
})
export class ContinueSignupComponent implements OnInit {
  public loading: any;
  userForm: FormGroup;
  storage: any;
  storageUser: any;
  user: User;

  constructor(private fb: FormBuilder, private firebaseUser: FirebaseUserService, private route: Router, private authService: AuthService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      gender: ['', Validators.required],
      age: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.storage = localStorage.getItem('user');
      this.storageUser = JSON.parse(this.storage);
      const uuid = this.storageUser?.uid;
      this.user = {
        email: this.storageUser?.email,
        emailVerified: this.storageUser?.emailVerified,
        uid: uuid,
        displayName: this.userForm.get('firstName')?.value,
        surName: this.userForm.get('lastName')?.value,
        age: this.userForm.get('age')?.value,
        ddd: Number(this.getDDD(this.userForm.get('phone')?.value)),
        gender: this.userForm.get('gender')?.value,
        phone: Number(this.getPhone(this.userForm.get('phone')?.value)),
        photoURL: '',
      };
      this.firebaseUser.updateUser(uuid, this.user).then(
        data => {
          localStorage.setItem('completeUser', JSON.stringify(this.user));
          this.route.navigate(['/user-detail']);
        }
      );
    }
  }

  getDDD(phoneNumber: string): number | null {
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
    return cleanedNumber.length >= 2 ? parseInt(cleanedNumber.substring(0, 2), 10) : null;
  }

  getPhone(phoneNumber: string): string | null {
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
    return cleanedNumber.length > 2 ? cleanedNumber.substring(2) : null;
  }

  applyPhoneMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    let formattedValue = '';
    if (value.length <= 2) {
      formattedValue = `(${value}`;
    } else if (value.length <= 7) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 11) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }
    input.value = formattedValue;
    this.userForm.controls['phone'].setValue(formattedValue, { emitEvent: false });
  }

  logout() {
    this.authService.SignOut();
  }
}

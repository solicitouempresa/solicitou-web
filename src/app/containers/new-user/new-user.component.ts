import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  formCadastro:FormGroup;
  loading:boolean = false;
  constructor(public authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.formCadastro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (value.length < 8 || !hasSpecialCharacter) {
      return { invalidPassword: true };
    }
    return null;
  }

  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  SignUp(){
  
    if(this.formCadastro.valid){
      this.loading = true;
      const email = this.formCadastro.get('email')?.value;
      const password = this.formCadastro.get('password')?.value;
      this.authService.SignUp(email, password).then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
      });
    }
    // this.authService.SignUp()
    // (click)="authService.SignUp(userEmail.value, userPwd.value)"
    // this.authService()
  }
}

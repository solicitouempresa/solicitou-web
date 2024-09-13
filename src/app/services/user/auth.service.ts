import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/models/userModel';
import * as auth from 'firebase/auth';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FirebaseUserService } from '../firebase-user-service/firebase-user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public snackBar: MatSnackBar,
    private firebaseUser: FirebaseUserService,
    private dialog: MatDialog
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          let uid = JSON.parse(localStorage.getItem('user')!)?.uid;
          this.firebaseUser.getUser(uid).subscribe(
            (data) => {
              const user = data as User;
              if(user != null && user?.displayName === null || user?.displayName === '') {
                this.router.navigate(['continue-signup']);
              } else {
                if(JSON.parse(localStorage.getItem('user')!) != null ) {
                  localStorage.setItem('completeUser', JSON.stringify(user));
                  this.router.navigate(['']);
                  uid = null;
                }
              }
            }
          )
        });
      })
      .catch((error) => {
        if(error.code === 'auth/wrong-password') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: { title: 'Ao entrar...', message: 'Usuário ou Senha Incorretos!' }  
          });
        }
        else if(error.code === 'auth/too-many-requests') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: { title: 'Ao entrar...', message: 'Foram muitas tentativas, tente novamente mais tarde!' }  
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: { title: 'Ao entrar...', message: error.message }  
          });
        }       
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.openSnackBar('Cadastrado com Sucesso', 'Ok');
        this.router.navigate(['']);
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        this.openSnackBar('Erro ao Cadastrar, tente novamente mais tarde', 'Ok');
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if(user && !user.emailVerified){
      this.router.navigate(['']);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { title: 'Validação de E-mail', message: 'Você precisa confirmar o seu e-mail.' }  
      });
    }
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      surName: user.surName || '',
      ddd: user.ddd || '',
      phone: user.phone || '',
      gender: user.gender || '',
      age: user.age || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified || false
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  
  // Sign out
  async SignOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('completeUser');
    this.router.navigate(['/']);
  }

  openSnackBar(message:string, action:string) {
    this.snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user:any;
  userJson: any;
  nameUser:string = '';
  completeUser: any;
  completeUserJosn: any;
  constructor(private router:Router, public authService:AuthService) { 
    this.user = localStorage.getItem('user');
    this.completeUser = localStorage.getItem('completeUser');
    this.userJson = JSON.parse(this.user);
    this.completeUserJosn = JSON.parse(this.completeUser);
  }

  ngOnInit(): void {
    if(this.user){  
      this.nameUser = this.completeUserJosn?.displayName;
    }
  }

  goToShoppinCart(){
    this.router.navigate(['shopping-cart']);
  }

  goToOrders(){
    this.router.navigate(['order-detail']);
  }

  goToHome(){
    this.router.navigate(['']);
  }

  goToLogin(){
    this.router.navigate(['login']);
  }

  goToUser(){

    if(this.authService.isLoggedIn){
      this.router.navigate(['user-detail']);
    } else {
      this.router.navigate(['login']);
    }

  }

}

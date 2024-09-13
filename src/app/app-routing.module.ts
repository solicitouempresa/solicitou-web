import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailEstablishmentComponent } from './containers/detail-establishment/detail-establishment.component';
import { DetailOrderComponent } from './containers/detail-order/detail-order.component';
import { DetailProductComponent } from './containers/detail-product/detail-product.component';
import { ListEstablishmentsComponent } from './containers/list-establishments/list-establishments.component';
import { ShoppingCartComponent } from './containers/shopping-cart/shopping-cart.component';
import { LoginComponent } from './containers/login/login.component';
import { NewUserComponent } from './containers/new-user/new-user.component';
import { UserDetailComponent } from './containers/user-detail/user-detail.component';
import { ForgotPasswordComponent } from './containers/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ContinueSignupComponent } from './containers/continue-signup/continue-signup.component';

const routes: Routes = [
  { path: 'inicio', component: ListEstablishmentsComponent},
  { path: 'detail-product/:name/:idProduct', component: DetailProductComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent},
  { path: 'order-detail', component: DetailOrderComponent},
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  { path: 'register-user', component: NewUserComponent},
  { path: 'user-detail', component: UserDetailComponent, canActivate: [AuthGuard]},
  { path: 'forgot-passoword', component: ForgotPasswordComponent},
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'continue-signup', component: ContinueSignupComponent, canActivate: [AuthGuard]},
  { path: '',   redirectTo: '/inicio', pathMatch: 'full' },
  { path: ':urlname', component: DetailEstablishmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

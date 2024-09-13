import { NgModule } from '@angular/core';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailEstablishmentComponent } from './containers/detail-establishment/detail-establishment.component';
import { ListEstablishmentsComponent } from './containers/list-establishments/list-establishments.component';
import {LOCALE_ID, DEFAULT_CURRENCY_CODE} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import { DetailProductComponent } from './containers/detail-product/detail-product.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCartComponent } from './containers/shopping-cart/shopping-cart.component';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AgmCoreModule} from '@agm/core';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import { DetailOrderComponent } from './containers/detail-order/detail-order.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import { CheckoutCartComponent } from './containers/checkout-cart/checkout-cart.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from './containers/login/login.component';
import { NewUserComponent } from './containers/new-user/new-user.component';
import { UserDetailComponent } from './containers/user-detail/user-detail.component';
import { ForgotPasswordComponent } from './containers/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './containers/verify-email/verify-email.component';
import { AuthService } from './services/user/auth.service';
import { getAuth } from 'firebase/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { ContinueSignupComponent } from './containers/continue-signup/continue-signup.component';
import { CartFooterComponent } from './shared/cart-footer/cart-footer.component';
import { OrderSpecificationDialogComponent } from './dialog/order-specification-dialog/order-specification-dialog.component';
import { EstablishmentCardDialogComponent } from './dialog/establishment-card-dialog/establishment-card-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailEstablishmentComponent,
    OrderSpecificationDialogComponent,
    ListEstablishmentsComponent,
    DetailProductComponent,
    ShoppingCartComponent,
    HeaderComponent,
    FooterComponent,
    DetailOrderComponent,
    CheckoutCartComponent,
    LoginComponent,
    NewUserComponent,
    UserDetailComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ConfirmationDialogComponent,
    EstablishmentCardDialogComponent,
    ContinueSignupComponent,
    CartFooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    MatButtonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCtBWYKz1OIm1SEHzlGwuZXoD6tX0tWL_o',
      libraries: ['places'],
      language:'pt',
      region:'BR'
    }),
    MatGoogleMapsAutocompleteModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    {
      provide:  DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

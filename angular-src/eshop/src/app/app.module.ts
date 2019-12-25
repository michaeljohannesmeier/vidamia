import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './customer/signup/signup.component';
import { SigninComponent } from './customer/signin/signin.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from './services/api.service';
import { SnackbarService } from './services/snackbar.service';
import { StateService } from './services/state.service';
import { HomeComponent } from './products/home/home.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SignupActivateComponent } from './customer/signup-activate/signup-activate.component';
import { SettingsMainComponent } from './settings/settings/settings-main.component';
import { PasswordChangeComponent } from './settings/password-change/password-change.component';
import { PasswordResetComponent } from './settings/password-reset/password-reset.component';
import { ActivateResetPasswordComponent } from './settings/activate-reset-password/activate-reset-password.component';
import { ChangeEmailComponent } from './settings/change-email/change-email.component';
import { ActivateChangeEmailComponent } from './settings/activate-change-email/activate-change-email.component';
import { AddToCartDialogComponent } from './products/add-to-cart-dialog/add-to-cart-dialog.component';
import { ShoppingItemsComponent } from './shopping/shopping-items/shopping-items.component';
import { CheckoutComponent } from './shopping/checkout/checkout.component';
import { CheckoutconfirmComponent } from './shopping/checkoutconfirm/checkoutconfirm.component';
import { CheckouterrorComponent } from './shopping/checkouterror/checkouterror.component';
import { LastOrdersComponent } from './settings/last-orders/last-orders.component';
import { PictureDetailDialogComponent } from './products/picture-detail-dialog/picture-detail-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { AngularWebStorageModule } from 'angular-web-storage';
import { TermsOfServiceComponent } from './footer/terms-of-service/terms-of-service.component';
import { AboutUsComponent } from './footer/about-us/about-us.component';
import { ContactComponent } from './footer/contact/contact.component';
import { MainFooterComponent } from './footer/main-footer/main-footer.component';
import { DeliveryComponent } from './footer/delivery/delivery.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    SigninComponent,
    HomeComponent,
    ProductDetailComponent,
    SignupActivateComponent,
    SettingsMainComponent,
    PasswordChangeComponent,
    PasswordResetComponent,
    ActivateResetPasswordComponent,
    ChangeEmailComponent,
    ActivateChangeEmailComponent,
    AddToCartDialogComponent,
    ShoppingItemsComponent,
    CheckoutComponent,
    CheckoutconfirmComponent,
    CheckouterrorComponent,
    LastOrdersComponent,
    PictureDetailDialogComponent,
    TermsOfServiceComponent,
    AboutUsComponent,
    ContactComponent,
    MainFooterComponent,
    DeliveryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularWebStorageModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  providers: [ ApiService, SnackbarService, StateService, CookieService ],
  bootstrap: [ AppComponent ],
  entryComponents: [ AddToCartDialogComponent, PictureDetailDialogComponent ]
})
export class AppModule { }

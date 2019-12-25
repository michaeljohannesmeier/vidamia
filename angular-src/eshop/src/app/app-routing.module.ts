import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './customer/signup/signup.component';
import { SigninComponent } from './customer/signin/signin.component';
import { HomeComponent } from './products/home/home.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SignupActivateComponent } from './customer/signup-activate/signup-activate.component';
import { SettingsMainComponent } from './settings/settings/settings-main.component';
import { PasswordChangeComponent } from './settings/password-change/password-change.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PasswordResetComponent } from './settings/password-reset/password-reset.component';
import { ActivateResetPasswordComponent } from './settings/activate-reset-password/activate-reset-password.component';
import { ChangeEmailComponent } from './settings/change-email/change-email.component';
import { ActivateChangeEmailComponent } from './settings/activate-change-email/activate-change-email.component';
import { ShoppingItemsComponent } from './shopping/shopping-items/shopping-items.component';
import { CheckoutComponent } from './shopping/checkout/checkout.component';
import { CheckoutconfirmComponent } from './shopping/checkoutconfirm/checkoutconfirm.component';
import { CheckouterrorComponent } from './shopping/checkouterror/checkouterror.component';
import { LastOrdersComponent } from './settings/last-orders/last-orders.component';
import { AboutUsComponent } from './footer/about-us/about-us.component';
import { TermsOfServiceComponent } from './footer/terms-of-service/terms-of-service.component';
import { ContactComponent } from './footer/contact/contact.component';
import { DeliveryComponent } from './footer/delivery/delivery.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/activate', component: SignupActivateComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'settings/main', component: SettingsMainComponent, canActivate: [AuthGuardService] },
  { path: 'changepassword', component: PasswordChangeComponent, canActivate: [AuthGuardService] },
  { path: 'passwordreset', component: PasswordResetComponent },
  { path: 'resetpassword/activate', component: ActivateResetPasswordComponent },
  { path: 'changeemail', component: ChangeEmailComponent },
  { path: 'changeemail/activate', component: ActivateChangeEmailComponent },
  { path: 'shoppingitems', component: ShoppingItemsComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] },
  { path: 'checkoutconfirm', component: CheckoutconfirmComponent, canActivate: [AuthGuardService]},
  { path: 'checkouterror', component: CheckouterrorComponent},
  { path: 'settings/lastorders', component: LastOrdersComponent, canActivate: [AuthGuardService]},
  { path: 'about', component: AboutUsComponent },
  { path: 'termsofservice', component: TermsOfServiceComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'delivery', component: DeliveryComponent}


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

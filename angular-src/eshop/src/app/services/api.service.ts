import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { StateService } from './state.service';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { LocalStorageService } from 'angular-web-storage';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string;
  httpOptions: any;
  constructor(private httpClient: HttpClient,
              private stateService: StateService,
              private cookieService: CookieService,
              private router: Router,
              private snackbarService: SnackbarService,
              private localStorageService: LocalStorageService) {
    if (isDevMode()) {
      this.baseUrl = 'http://localhost:1337';
    } else {
      this.baseUrl = '';
    }
  }

  getHeaders() {
    return new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'Bearer ' + this.cookieService.get('vidamia-jwt')
    });
  }

  signup({email, password, first_name, last_name, street, zipcode, city, country}) {
    return this.httpClient.post<any>(this.baseUrl + '/api/signup/',
    { email, password, first_name, last_name, street, zipcode, city, country}, { observe: 'response'});
  }

  signin(email: string, password: string) {
    return this.httpClient.post<any>(this.baseUrl + '/api/signin/', {email, password}, { observe: 'response' });
  }

  getUser() {
    const headers = this.getHeaders();
    this.httpClient.get<any>(this.baseUrl + '/api/getuser/', { headers, observe: 'response' }).subscribe(result => {
      if (result.status === 200) {
        this.stateService.login(result.body);
        this.router.navigate([this.stateService.getRedirect()]);
        this.stateService.setRedirect('/');
      } else {
        this.snackbarService.show('Login fehlgeschlagen', '', 'snackbar-failure');
      }
    },
    error => {
        this.snackbarService.show('Login fehlgeschlagen', '', 'snackbar-failure');
    });
  }

  getProducts() {
    return this.httpClient.get<any>(this.baseUrl + '/api/products/', { observe: 'response' })
    .subscribe(response => {
      if (response.status === 200) {
        this.stateService.products$.next(response.body.products);
        this.stateService.mainPictures$.next(response.body.main_pictures);
      }
    });
  }

  getProduct(id: number) {
    return this.httpClient.get<any>(this.baseUrl + '/api/product/' + id + '/', { observe: 'response' });
  }

  signupActivate(uidb64: string, token: string) {
    return this.httpClient.post<any>(this.baseUrl + '/api/signup/activate/', {uidb64, token}, { observe: 'response' });
  }

  saveSettings({first_name, last_name, street, zipcode, city}) {
    const headers = this.getHeaders();
    const email = this.stateService.getUserData().email;
    return this.httpClient.post<any>(this.baseUrl + '/api/savesettings/',
    { email, first_name, last_name, street, zipcode, city}, { headers, observe: 'response' });
  }

  changePassword(passwordOld, passwordNew) {
    const headers = this.getHeaders();
    const email = this.stateService.getUserData().email;
    return this.httpClient.post<any>(this.baseUrl + '/api/changepassword/',
    { email, password_old: passwordOld, password_new: passwordNew }, { headers, observe: 'response' });
  }

  passwordReset({email}) {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(this.baseUrl + '/api/passwordreset/',
    { email }, { headers, observe: 'response' });
  }

  activateResetPassword(uidb64, token, password) {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(this.baseUrl + '/api/passwordreset/activate/',
    { uidb64, token, password }, { headers, observe: 'response' });
  }

  changeEmail(newemail) {
    const headers = this.getHeaders();
    const oldemail = this.stateService.getUserData().email;
    return this.httpClient.post<any>(this.baseUrl + '/api/changeemail/',
    { oldemail, newemail }, { headers, observe: 'response' });
  }

  activateChangeEmail(uidb64, token, newemail) {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(this.baseUrl + '/api/changeemail/activate/',
    { newemail, uidb64, token }, { headers, observe: 'response' });
  }

  getLastOders() {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(this.baseUrl + '/api/lastorders/', { headers, observe: 'response' });
  }

  getOrderedProduct(shoppingItems) {
    const shoppingItemKeys = Object.keys(shoppingItems);
    const orderedProducts = [];
    shoppingItemKeys.forEach(key => {
      const orderedProduct = {
        title: shoppingItems[key].product.title,
        category: shoppingItems[key].product.category,
        product_id: shoppingItems[key].product.id,
        amount: shoppingItems[key].amount,
        size: shoppingItems[key].size,
        price: shoppingItems[key].product.price,
        sub_total: parseFloat(shoppingItems[key].product.price) * shoppingItems[key].amount
      };
      orderedProducts.push(orderedProduct);
    });
    return orderedProducts;
  }

  paymentPaypal(orderId, total, shoppingItems) {
    const headers = this.getHeaders();
    const orderedProducts = this.getOrderedProduct(shoppingItems);
    return this.httpClient.post<any>(this.baseUrl + '/api/paymentpaypal/',
    {order_id: orderId, total, ordered_products: orderedProducts}, { headers, observe: 'response' });
  }

  paymentTransfer(total, shoppingItems) {
    const headers = this.getHeaders();
    const orderedProducts = this.getOrderedProduct(shoppingItems);
    return this.httpClient.post<any>(this.baseUrl + '/api/paymenttransfer/',
    {total, ordered_products: orderedProducts}, { headers, observe: 'response' });
  }

  refreshToken(token: string) {
    console.log('refresh token triggered');
    return this.httpClient.post<any>(this.baseUrl + '/api/refreshtoken/', {token}, { observe: 'response' }).subscribe(response => {
      if (response.status === 200) {
        this.cookieService.set('vidamia-jwt', response.body.token);
        this.getUser();
      }
    });

  }


}

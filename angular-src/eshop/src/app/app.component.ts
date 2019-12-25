import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './services/api.service';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean;

  constructor(private stateService: StateService,
              private apiService: ApiService,
              private cookieService: CookieService,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  loggedIn = false;

  ngOnInit() {

    this.stateService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    this.stateService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
    const tokenJwt = this.cookieService.get('vidamia-jwt');
    console.log(tokenJwt);
    if (tokenJwt && !this.loggedIn) {
      this.stateService.setRedirect(this.router.url);
      this.apiService.refreshToken(tokenJwt);
    }
    this.stateService.setShoppingItems();
  }

  onActivate(event) {
    window.scroll(0, 0);
  }


}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private stateServiece: StateService,
              private router: Router) { }

  loggedIn = false;
  shoppingItemsAmount: number;
  settingsActive = false;

  ngOnInit() {
    this.router.events.subscribe(value => {
      if (this.router.url.indexOf('/settings') > -1) {
        this.settingsActive = true;
      } else {
        this.settingsActive = false;
      }
    });
    this.stateServiece.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
    this.stateServiece.shoppingItems$.subscribe(shoppingItems => {
      if (shoppingItems) {
        const keys = Object.keys(shoppingItems);
        let amount = 0;
        keys.forEach(key => {
          amount += shoppingItems[key].amount;
        });
        this.shoppingItemsAmount = amount;
      }
    });
  }

  logout() {
    this.stateServiece.logout();
  }

}

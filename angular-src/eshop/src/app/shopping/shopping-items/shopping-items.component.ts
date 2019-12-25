import { Component, OnInit, isDevMode } from '@angular/core';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-shopping-items',
  templateUrl: './shopping-items.component.html',
  styleUrls: ['./shopping-items.component.scss']
})
export class ShoppingItemsComponent implements OnInit {

  constructor(private stateService: StateService,
              private router: Router,
              private snackbarService: SnackbarService) { }

  shoppingItems: any[];
  urlPrefix = '';
  shoppingItemKeys: string [];
  total: string;
  loggedIn: boolean;

  ngOnInit() {
    if (isDevMode()) {
      this.urlPrefix = 'http://localhost:1337';
    }
    this.stateService.shoppingItems$.subscribe(shoppingItems => {
      this.shoppingItemKeys = Object.keys(shoppingItems);
      this.shoppingItems = shoppingItems;
      console.log(this.shoppingItems);

      let total = 0;
      this.shoppingItemKeys.forEach(key => {
        total += this.shoppingItems[key].product.price * this.shoppingItems[key].amount;
      });
      this.total = total.toFixed(2);
    });
    this.stateService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });

  }

  cardClick(event, shoppingItem) {
    if (event.srcElement.className.includes('mat-button')) {
      // other (click) events are executed in this case
    } else {
      this.router.navigate(['/product', shoppingItem.product.id]);
    }
  }

  itemUp(shoppingItem) {
    this.stateService.changeAmountToShoppingItem(shoppingItem, 'up');
  }

  itemDown(shoppingItem) {
    this.stateService.changeAmountToShoppingItem(shoppingItem, 'down');
  }

  removeItem(shoppingItem) {
    this.stateService.removvidamiapingItem(shoppingItem);
  }

  getSubTotal(shoppingItem) {
    return 'Sub-total ' + (shoppingItem.product.price * shoppingItem.amount).toFixed(2) + '€';
  }

  getTotal() {
    let total = 0;
    this.shoppingItemKeys.forEach(key => {
      total += this.shoppingItemKeys[key].product.price * this.shoppingItemKeys[key].amount;
    });
    return total.toFixed(2);
  }

  goToCheckout() {
    if (this.loggedIn) {
      this.router.navigate(['/checkout']);
    } else {
      this.snackbarService.show('Bitte loggen Sie sich ein um zu bestellen', '', 'snackbar-success');
      this.stateService.setRedirect('/checkout');
      this.router.navigate(['/signin']);
    }
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'angular-web-storage';
import { SnackbarService } from './snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private cookieService: CookieService,
              private localStorageService: LocalStorageService,
              private snackbarService: SnackbarService) { }

  loggedIn$ = new BehaviorSubject(false);
  products$ = new BehaviorSubject([]);
  userData: any;
  shoppingItems: any = {};
  shoppingItems$ = new BehaviorSubject(this.shoppingItems);
  redirect = '/';
  mainPictures$ = new BehaviorSubject([]);
  loading$ = new BehaviorSubject(false);


  login(userData) {
    this.userData = userData;
    this.loggedIn$.next(true);
  }

  logout() {
    this.loggedIn$.next(false);
    this.cookieService.delete('vidamia-jwt', '/');
  }

  getUserData() {
     return this.userData;
  }

  setShoppingItems() {
    this.products$.subscribe(products => {
      const shoppingItems = this.localStorageService.get('vidamia-shopping');
      let removed = false;
      if (shoppingItems) {
        products.forEach(product => {
          [37, 38, 39, 40, 41].forEach(size => {
            const itemsInShoppingCart = shoppingItems[product.category + size] === undefined ?
            0 : shoppingItems[product.category + size].amount;
            if (product['size_' + size] - itemsInShoppingCart < 0) {
              removed = true;
              delete shoppingItems[product.category + size];
            }
          });
        });
        this.shoppingItems = shoppingItems;
      }
      this.shoppingItems$.next(this.shoppingItems);
      if (removed) {
        this.snackbarService.show(
          'Ein Produkt, welches sich in Ihrem Einkaufswagen befunden hat, ist nicht mehr verfügbar', '', 'snackbar-failure');
      }
    });
    this.shoppingItems$.next(this.shoppingItems);
  }

  addShoppingItem(product, size, amount) {
    if (this.shoppingItems[product.category + size]) {
      this.shoppingItems[product.category + size].amount += amount;
    } else {
      this.shoppingItems[product.category + size] = {product, size, amount};
    }
    this.shoppingItems$.next(this.shoppingItems);
    this.localStorageService.set('vidamia-shopping', this.shoppingItems, 24, 'h');
  }

  getShoppingItems() {
    return this.shoppingItems;
  }

  resetShoppingItems() {
    this.shoppingItems = {};
    this.shoppingItems$.next(this.shoppingItems);
    this.localStorageService.set('vidamia-shopping', this.shoppingItems, 24, 'h');
  }

  getShoppingItemsAmount() {
    let amount = 0;
    Object.keys(this.shoppingItems).forEach(key => {
      amount += this.shoppingItems[key].amount;
    });
    return amount;
  }

  removvidamiapingItem(product) {
    delete this.shoppingItems[product.product.category + product.size];
    this.shoppingItems$.next(this.shoppingItems);
    this.localStorageService.set('vidamia-shopping', this.shoppingItems, 24, 'h');
  }

  changeAmountToShoppingItem(product, direction) {
    const shoppingItem = this.shoppingItems[product.product.category + product.size];
    if (direction === 'up') {
      shoppingItem.amount += 1;
    } else {
      if (shoppingItem.amount === 1) {
        delete this.shoppingItems[product.product.category + product.size];
      } else {
        shoppingItem.amount -= 1;
      }
    }
    this.shoppingItems$.next(this.shoppingItems);
    this.localStorageService.set('vidamia-shopping', this.shoppingItems, 24, 'h');
  }

  setRedirect(url) {
    this.redirect = url;
  }

  getRedirect() {
    return this.redirect;
  }

  // getAvailableProducts(products) {
  //   if (this.shoppingItems) {
  //     const availableProduct = [];
  //     products.forEach(product => {
  //       let amount = 0;
  //       [37, 38, 39, 40, 41].forEach(size => {
  //         const itemsInShoppingCart = this.shoppingItems[product.category + size] === undefined ?
  //         0 : this.shoppingItems[product.category + size].amount;
  //         amount += product['size_' + size] - itemsInShoppingCart;
  //       });
  //       if (amount > 0) {
  //         availableProduct.push(product);
  //       }
  //     });
  //     return availableProduct;
  //   } else {
  //     return products;
  //   }
  // }


}

import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-checkoutconfirm',
  templateUrl: './checkoutconfirm.component.html',
  styleUrls: ['./checkoutconfirm.component.scss']
})
export class CheckoutconfirmComponent implements OnInit {

  constructor(private stateService: StateService,
              private apiService: ApiService,
              private snackbarService: SnackbarService) { }

  products: any[] = [];
  total: string;
  lastOrder: any;

  ngOnInit() {
    this.apiService.getLastOders().subscribe(result => {
      if (result.status === 200) {
        this.lastOrder = result.body[0];
        this.products = this.lastOrder.ordered_products;
      }
    },
    error => {
        this.snackbarService.show(
          'Es ist ein Fehler aufgetreten. Ihre letzten Bestellungen konnten nicht geladen werden.', '', 'snackbar-failure'
        );
    });
    this.stateService.resetShoppingItems();
    let total = 0;
    this.products.forEach(product => {
      total += product.price * product.amount;
    });
    this.total = total.toFixed(2);
  }

  getSubTotal(product) {
    return (product.price * product.amount).toFixed(2) + '€';
  }

}

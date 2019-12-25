import { Component, OnInit, Renderer2, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { StateService } from '../../services/state.service';
import { DOCUMENT } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

declare let paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private stateService: StateService,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private apiService: ApiService,
              private router: Router,
              private snackbarService: SnackbarService) { }

  shoppingItems: any[];
  urlPrefix = '';
  shoppingItemKeys: string [];
  total: string;
  userData: any;
  transactionStatus = '';
  @ViewChild('paypal', {static: true}) paypal: ElementRef;
  // @ViewChild('creditcard', {static: true}) creditcard: ElementRef;
  @ViewChild('transfer', {static: true}) transfer: ElementRef;
  selectedPaymentMethod: string;


  public ngOnInit() {
    this.userData = this.stateService.getUserData();
    this.stateService.shoppingItems$.subscribe(shoppingItems => {
      this.shoppingItemKeys = Object.keys(shoppingItems);
      this.shoppingItems = shoppingItems;

      let total = 0;
      this.shoppingItemKeys.forEach(key => {
        total += this.shoppingItems[key].product.price * this.shoppingItems[key].amount;
      });
      this.total = total.toFixed(2);
    });

    this.loadExternalScript(
      'https://www.paypal.com/sdk/js?client-id=ARvyZybD71P3l5rA-b85h0VkgCGX1JkCSr4AkkOkcvLhYTt610dkyF7ci4VST43zAJWbGc3iC6ifbzyh')
      .then(() => {
        paypal.Buttons({
          locale: 'de_DE',
          style: {
            layout:  'horizontal',
            color:   'blue',
            shape:   'rect',
            label:   'buynow',
            tagline: 'false',
            size: 'responsive'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.total
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            this.stateService.loading$.next(true);
            return actions.order.capture().then(details => {
              return this.apiService.paymentPaypal(data.orderID, this.total, this.shoppingItems).toPromise().then(response => {
                this.stateService.loading$.next(false);
                if (response.status === 200) {
                  this.router.navigate(['/checkoutconfirm']);
                } else {
                  this.router.navigate(['/checkouterror']);
                }
              });
            },
            error => {
              this.stateService.loading$.next(false);
              this.router.navigate(['/checkouterror']);
            });
          }
        }).render('#paypal-button-container');
    });
  }

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const s = this.renderer2.createElement('script');
      s.src = scriptUrl;
      s.onload = resolve;
      this.renderer2.appendChild(this.document.body, s);
    });
  }

  updatePaymentInfo(paymentMethod) {
    this.renderer2.setStyle(this.paypal.nativeElement, 'display', paymentMethod === 'paypal' ? 'block' : 'none');
    // this.renderer2.setStyle(this.creditcard.nativeElement, 'display', paymentMethod === 'creditcard' ? 'block' : 'none');
    this.renderer2.setStyle(this.transfer.nativeElement, 'display', paymentMethod === 'transfer' ? 'block' : 'none');
  }

  getSubTotal(shoppingItem) {
    return (shoppingItem.product.price * shoppingItem.amount).toFixed(2) + '€';
  }

  goToSettings() {
    this.stateService.setRedirect('/checkout');
    this.router.navigate(['/settings/main']);
  }

  payPerTransfer() {
    return this.apiService.paymentTransfer(this.total, this.shoppingItems).subscribe(result => {
      if (result.status === 200) {
        this.router.navigate(['/checkoutconfirm']);
      }
    },
    error => {
        this.snackbarService.show(
          'Es ist ein Fehler aufgetreten. Ihre Bestellung konnte leider nicht gespeichert werden', '', 'snackbar-failure'
        );
    });
  }

}

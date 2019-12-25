import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { isDevMode } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';
import { StateService } from '../../services/state.service';
import { PictureDetailDialogComponent } from '../picture-detail-dialog/picture-detail-dialog.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;
  product: any;
  urlPrefix = '';
  availableSizes = [];
  availableAmounts = {};
  selectedAmount = 1;
  selectedSize: number;
  selectedPictureUrl: string;
  selectedPictureNr: number;
  addedSomething = false;
  productAvailable = true;
  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              public dialog: MatDialog,
              private stateService: StateService,
              private router: Router) { }

  ngOnInit() {
    if (isDevMode()) {
      this.urlPrefix = 'http://localhost:1337';
    }
    this.sub = this.route.params.subscribe(p => {
      this.id = +p.id;
      this.getAvailableProducts();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAvailableProducts() {
    this.apiService.getProduct(this.id).subscribe(response => {
      const tmpAvailableSizes = [];
      if (response.status === 200) {
        this.product = response.body;
        let availableAmountTotal = 0;
        [37, 38, 39, 40, 41].forEach(size => {
          const itemsInShoppingCart = this.stateService.shoppingItems[this.product.category + size] === undefined ?
          0 : this.stateService.shoppingItems[this.product.category + size].amount;
          const availableAmount = this.product['size_' + size] - itemsInShoppingCart;
          availableAmountTotal += availableAmount;
          const availableAmountArray = [];
          for (let i = 1; i <= availableAmount; i++) {
            availableAmountArray.push(i);
          }
          this.availableAmounts[size] = availableAmountArray;
          if (availableAmount > 0 ) {
            tmpAvailableSizes.push(size);
          }
        });
        this.availableSizes = tmpAvailableSizes;
        this.selectedSize = tmpAvailableSizes[0];
        this.selectedPictureNr = 1;
        this.selectedAmount = 1;
        this.selectedPictureUrl = this.product['image_' + this.selectedPictureNr];
        if (availableAmountTotal === 0) {
          this.productAvailable = false;
        }
      }
    });
  }
  selectPicture(selectedNumber) {
    this.selectedPictureNr = selectedNumber;
    this.selectedPictureUrl = this.product['image_' + this.selectedPictureNr];
  }

  addToCart() {

      this.addedSomething = true;
      this.stateService.addShoppingItem(this.product, this.selectedSize, this.selectedAmount);
      this.getAvailableProducts();

  }

}

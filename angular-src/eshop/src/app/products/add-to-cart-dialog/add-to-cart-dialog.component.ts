import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  availableSizes: number[];
  price: number;
  imageUrl: string;
}


@Component({
  selector: 'app-add-to-cart-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['./add-to-cart-dialog.component.scss']
})
export class AddToCartDialogComponent implements OnInit {

  selectedSize: number;

  constructor(
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.selectedSize = this.data.availableSizes[0];
  }

  addToShoppingCart(selectedSize) {
    this.dialogRef.close(selectedSize);
  }

}

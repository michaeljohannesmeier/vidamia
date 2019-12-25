import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface DialogData {
  url1: string;
  url2: string;
  url3: string;
  urlPrefix: string;
}

@Component({
  selector: 'app-picture-detail-dialog',
  templateUrl: './picture-detail-dialog.component.html',
  styleUrls: ['./picture-detail-dialog.component.scss']
})
export class PictureDetailDialogComponent implements OnInit {

  selectedImageUrl: string;
  selectedImageId: number;

  constructor(
    public dialogRef: MatDialogRef<PictureDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.selectedImageUrl = this.data.urlPrefix + this.data.url1;
    this.selectedImageId = 1;

  }

  newMain(imageUrl, imageId) {
    this.selectedImageUrl = imageUrl;
    this.selectedImageId = imageId;
  }

}

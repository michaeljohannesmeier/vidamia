import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
   }

   show(message: string, action: string, panelClass: string, duration?: number) {
    if (!duration) {
      duration = 6000;
    }
    this.snackBar.open(message, action, {
      duration,
      panelClass
    });
   }
}

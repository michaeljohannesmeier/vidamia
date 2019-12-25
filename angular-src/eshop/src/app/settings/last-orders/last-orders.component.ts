import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-last-orders',
  templateUrl: './last-orders.component.html',
  styleUrls: ['./last-orders.component.scss']
})
export class LastOrdersComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarService: SnackbarService) { }

  lastOrders = [];

  ngOnInit() {
    this.apiService.getLastOders().subscribe(result => {
      if (result.status === 200) {
        this.lastOrders = result.body;
      }
    },
    error => {
        this.snackbarService.show(
          'Es ist ein Fehler aufgetreten. Ihre letzten Bestellungen konnten nicht geladen werden.', '', 'snackbar-failure'
        );
    });
  }

}

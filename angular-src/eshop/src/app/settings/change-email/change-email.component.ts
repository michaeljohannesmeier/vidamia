import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarService: SnackbarService,
              private router: Router) { }

  changeEmailForm: FormGroup;

  ngOnInit() {
    this.changeEmailForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
    });
  }

  onSubmit() {
    this.apiService.changeEmail(this.changeEmailForm.value.email).subscribe(result => {
        if (result.status === 200) {
          this.snackbarService.show('Bitte überprüfen Sie Ihr Email-Postfach', '', 'snackbar-success');
          this.router.navigate(['/']);
        } else {
          this.snackbarService.show(
            'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
            '', 'snackbar-failure');
        }
      },
      error => {
        this.snackbarService.show(
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.', '',
          'snackbar-failure');
      });
  }

}

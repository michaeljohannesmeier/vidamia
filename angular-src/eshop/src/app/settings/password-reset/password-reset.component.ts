import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarService: SnackbarService,
              private router: Router) { }

  passwordResetForm: FormGroup;

  ngOnInit() {
    this.passwordResetForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
    });
  }

  onSubmit() {
    this.apiService.passwordReset(this.passwordResetForm.value).subscribe(result => {
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
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
          '', 'snackbar-failure');
      });
  }
}

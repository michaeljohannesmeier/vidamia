import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { StateService } from '../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {


  constructor(private apiService: ApiService,
              private snackbarService: SnackbarService,
              private stateService: StateService,
              private router: Router,
              private route: ActivatedRoute,
              private cookieService: CookieService) { }

  signinForm: FormGroup;

  ngOnInit() {

    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.route.queryParams.subscribe(qparams => {
      if (qparams.email) {
        this.signinForm.get('email').setValue(qparams.email);
      }
    });
  }


  onSingIn() {
    this.apiService.signin(this.signinForm.value.email.toLowerCase(), this.signinForm.value.password).subscribe(result => {
        if (result.status === 200) {
          this.snackbarService.show('Login erfolgreich', '', 'snackbar-success');
          this.cookieService.set('vidamia-jwt', result.body.token);
          this.apiService.getUser();
        } else {
          this.snackbarService.show('Login fehlgeschlagen', '', 'snackbar-failure');
        }
    },
    error => {
      if (error.error.email_not_confirmed) {
        this.snackbarService.show(
          'Bitte überprüfen Sie Ihre Emails. Klicken Sie auf den Link um Ihren Account zu aktivieren.', '', 'snackbar-failure');
      } else if (error.error.login_failed) {
        this.snackbarService.show('Login fehlgeschlagen. Email/Passwort stimmen nicht', '', 'snackbar-failure');
      } else {
        this.snackbarService.show('Login fehlgeschlagen', '', 'snackbar-failure');
      }
    });
  }


}

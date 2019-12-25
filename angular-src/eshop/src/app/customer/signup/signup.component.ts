import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {



  constructor(private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private router: Router,
              private stateService: StateService) { }


  countries = [
    {label: 'Deutschland', value: 'DE'},
    {label: 'Österreich', value: 'AU'},
    {label: 'Schweiz', value: 'SE'},
  ];
  selectedCountry = 'DE';
  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, this.passwordStrength]),
      password2: new FormControl(null, [Validators.required, this.passwordsMatch]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      street: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
    });
  }

  passwordsMatch(control: FormControl) {
    if (control.parent) {
      const password = control.parent.value.password;
      const password2 = control.value;
      return password === password2 ? null : { noMatch: true };
    } else {
      return null;
    }
  }


  passwordStrength(control: FormControl): ValidationResult {
      const hasNumber = /\d/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);
      const valid = hasNumber && hasUpper && hasLower;
      if (!valid) {
          return { passWeak: true };
      }
      return null;
  }

  onSingUp() {
    this.stateService.loading$.next(true);
    this.apiService.signup(this.signupForm.value).subscribe(result => {
      if (result.status === 201) {
        this.snackbarSercie.show(
          'Bitte überprüfen Sie Ihren Email-Account und bestätigen Sie Ihre Registrierung',
          'Ok', 'snackbar-success', 10000);
        this.router.navigate([this.stateService.getRedirect()]);
        this.stateService.setRedirect('/');
      } else {
        this.snackbarSercie.show(
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
          '', 'snackbar-failure');
      }
      this.stateService.loading$.next(false);
    },
    error => {
      if (error.error.email_unique) {
        this.snackbarSercie.show(
          'Die von Ihnen gewünschte Email-Adresse ist bei uns schon registriert. Falls Sie Ihr Passwort vergessen haben, kliken Sie unten auf den Button "Passwort vergessen?"',
          '', 'snackbar-failure');
      } else {
        this.snackbarSercie.show(
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
          '', 'snackbar-failure');
      }
      this.stateService.loading$.next(false);
  });
  }


}

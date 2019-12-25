import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { StateService } from '../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface ValidationResult {
  [key: string]: boolean;
}

@Component({
  selector: 'app-activate-reset-password',
  templateUrl: './activate-reset-password.component.html',
  styleUrls: ['./activate-reset-password.component.scss']
})
export class ActivateResetPasswordComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private stateService: StateService,
              private router: Router,
              private route: ActivatedRoute) { }

  activateResetPasswordForm: FormGroup;
  uidb64: string;
  token: string;

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      this.uidb64 = qparams.uidb64;
      this.token = qparams.token;
    });
    this.activateResetPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      password2: new FormControl(null, [Validators.required, this.passwordStrength]),
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

  onSubmit() {
    this.apiService.activateResetPassword(
      this.uidb64, this.token, this.activateResetPasswordForm.value.password
      ).subscribe(response => {
      if (response.status === 200) {
        this.snackbarSercie.show('Passwort wurde geändert. Bitte loggen Sie sich ein.', '',  'snackbar-success');
        this.router.navigate(['/signin'], { queryParams: {email: response.body.email }});
      } else {
        this.snackbarSercie.show('Passwortänderung nicht möglich', '', 'snackbar-failure');
      }
    });
  }

}

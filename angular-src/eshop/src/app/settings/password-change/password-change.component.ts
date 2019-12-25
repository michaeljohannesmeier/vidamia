import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { StateService } from '../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';


interface ValidationResult {
  [key: string]: boolean;
}


@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private stateService: StateService,
              private router: Router,
              private route: ActivatedRoute) { }

    changePasswordForm: FormGroup;

    ngOnInit() {
      this.changePasswordForm = new FormGroup({
        passwordOld: new FormControl(null, [Validators.required]),
        passwordNew1: new FormControl(null, [Validators.required, this.passwordStrength]),
        passwordNew2: new FormControl(null, [Validators.required, this.passwordsMatch])
      });
    }


  passwordsMatch(control: FormControl) {
    if (control.parent) {
      const password = control.parent.value.passwordNew1;
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

  onChangePassword() {
    this.apiService.changePassword(
      this.changePasswordForm.value.passwordOld, this.changePasswordForm.value.passwordNew1
    ).subscribe(result => {
      if (result.status === 200) {
        this.snackbarSercie.show('Passwort wurde erfolgreich geändert', '', 'snackbar-success');
        this.router.navigate(['/settings/main']);
      } else {
        this.snackbarSercie.show('Passwort ändern fehlgeschlagen', '', 'snackbar-failure');
      }
    },
    error => {
        if (error.error.wrong_pass) {
          this.snackbarSercie.show(
            'Passwort ändern nicht möglich. Sie haben altes Ihr Passwort nicht richtig eingegeben.', '',  'snackbar-failure');
        } else {
          this.snackbarSercie.show('Passwort ändern fehlgeschlagen', '', 'snackbar-failure');
        }
      });
  }


}

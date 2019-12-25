import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { StateService } from '../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-activate-change-email',
  templateUrl: './activate-change-email.component.html',
  styleUrls: ['./activate-change-email.component.scss']
})
export class ActivateChangeEmailComponent implements OnInit {

  constructor(private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private stateService: StateService,
              private router: Router,
              private route: ActivatedRoute) { }

  activateResetPasswordForm: FormGroup;
  uidb64: string;
  token: string;
  newemail: string;

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      this.uidb64 = qparams.uidb64;
      this.token = qparams.token;
      this.newemail = qparams.newemail;
      this.apiService.activateChangeEmail(
        this.uidb64, this.token, this.newemail
        ).subscribe(response => {
          if (response.status === 200) {
            this.stateService.logout();
            this.snackbarSercie.show(
              'Email Addresse wurde geändert. Sie können sich jetzt mit Ihrer neuen Email Addresse einloggen.', '',  'snackbar-success');
            this.router.navigate(['/signin'], { queryParams: {email: response.body.email }});
          } else {
            this.snackbarSercie.show('Änderung der Email fehlgeschlagen', '',  'snackbar-failure');
          }
        },
        error => {
          if (error.error.account_already_exists) {
            this.snackbarSercie.show(
              'Email ändern nicht möglich. Es gibt bereits einen Account mit der von Ihnen angegebenen Email Addresse.', '',
              'snackbar-failure');
          } else {
            this.snackbarSercie.show('Änderung der Email fehlgeschlagen', '', 'snackbar-failure');
          }
        });
    });
  }

}

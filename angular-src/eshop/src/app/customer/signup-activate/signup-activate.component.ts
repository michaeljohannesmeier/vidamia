import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-activate',
  templateUrl: './signup-activate.component.html',
  styleUrls: ['./signup-activate.component.scss']
})
export class SignupActivateComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      this.apiService.signupActivate(qparams.uidb64, qparams.token).subscribe(response => {
        if (response.status === 200) {
          this.snackbarSercie.show('Email bestätigt. Bitte loggen Sie sich ein.', '', 'snackbar-success');
          this.router.navigate(['/signin'], { queryParams: {email: response.body.email }});
        } else {
          this.snackbarSercie.show('Aktivierung nicht möglich, bitte registrieren Sie sich erneut', '', 'snackbar-failure');
          this.router.navigate(['/signup']);
        }
      });
    });
  }

}

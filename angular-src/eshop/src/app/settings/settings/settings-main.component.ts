import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';


@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent implements OnInit {


  constructor(private apiService: ApiService,
              private snackbarSercie: SnackbarService,
              private router: Router,
              private stateService: StateService) { }

  settingsForm: FormGroup;

  ngOnInit() {
    this.settingsForm = new FormGroup({
      email: new FormControl({ value: null, disabled: true }, []),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      street: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
    });
    this.settingsForm.setValue(this.stateService.getUserData());
  }



  onSave() {
    this.apiService.saveSettings(this.settingsForm.value).subscribe(result => {
      if (result.status === 200) {
        this.stateService.login(result.body);
        this.settingsForm.setValue(this.stateService.getUserData());
        this.snackbarSercie.show('Daten wurden erfolgreich aktualisiert', '', 'snackbar-success');
        this.router.navigate([this.stateService.getRedirect()]);
        this.stateService.setRedirect('/');
      } else {
        this.snackbarSercie.show(
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
           '', 'snackbar-failure');
      }
      },
      error => {
        this.snackbarSercie.show(
          'Es ist ein Fehler aufgetreten. Evtl. haben Sie keine Internetverbindung oder es besteht ein Serverproblem.',
        '', 'snackbar-failure');
      });
    }

}

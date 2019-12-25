import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StateService } from './state.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  loggedIn: boolean;
  constructor(private stateService: StateService,
              private router: Router) {
                this.stateService.loggedIn$.subscribe((authenticated: boolean) => {
                  this.loggedIn = authenticated;
                });
              }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> |
   boolean {
     if (this.loggedIn) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}

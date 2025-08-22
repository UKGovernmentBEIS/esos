import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { combineLatest, first, Observable, of, switchMap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore, selectAuthenticationStatus, selectIsLoggedIn, selectUserRoleType } from '@core/store';

@Injectable({ providedIn: 'root' })
export class RegisterUserGuard {
  constructor(
    private readonly authStore: AuthStore,
    private readonly authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.authService.checkUser().pipe(
      switchMap(() =>
        combineLatest([
          this.authStore.pipe(selectIsLoggedIn),
          this.authStore.pipe(selectUserRoleType),
          this.authStore.pipe(selectAuthenticationStatus),
        ]),
      ),
      switchMap(([isLoggedIn, roleType, authenticationStatus]) => {
        if (!isLoggedIn) {
          return of(this.router.parseUrl('landing'));
        }

        if (roleType !== 'OPERATOR') {
          return of(this.router.parseUrl('landing'));
        }

        if (authenticationStatus == 'REGISTERED') {
          return of(this.router.parseUrl('dashboard'));
        }

        return of(true);
      }),
      first(),
    );
  }
}

import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { first, map, Observable } from 'rxjs';

import { AuthStore, selectAuthenticationStatus } from '@core/store/auth';

@Injectable({ providedIn: 'root' })
export class RegisteredUserGuard {
  constructor(
    private readonly authStore: AuthStore,
    private router: Router,
  ) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.authStore.pipe(
      selectAuthenticationStatus,
      map((authenticationStatus) => {
        if (authenticationStatus != 'REGISTERED') {
          return this.router.parseUrl('landing');
        }

        return true;
      }),
      first(),
    );
  }
}

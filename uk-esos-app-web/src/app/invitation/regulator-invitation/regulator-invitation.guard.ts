import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlSerializer } from '@angular/router';

import { catchError, combineLatest, first, map, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore, selectIsLoggedIn } from '@core/store';
import { isBadRequest } from '@error/business-errors';

import { RegulatorUsersRegistrationService, UserTokenService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class RegulatorInvitationGuard implements CanActivate {
  constructor(
    private readonly authStore: AuthStore,
    private readonly router: Router,
    private readonly regulatorUsersRegistrationService: RegulatorUsersRegistrationService,
    private readonly userTokenService: UserTokenService,
    private readonly authService: AuthService,
    private urlSerializer: UrlSerializer,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const urlTree = this.urlSerializer.parse(state.url);

    const token = urlTree.queryParams['token'];
    if (!token) {
      this.router.navigate(['invitation/regulator/invalid-link']);
      return of(false);
    }

    return this.authService.checkUser().pipe(
      switchMap(() => combineLatest([this.authStore.pipe(selectIsLoggedIn)])),
      switchMap(([isLoggedIn]) => {
        if (!isLoggedIn) {
          return this.userTokenService.resolveEmailByToken({ token, type: 'REGULATOR_INVITATION' }).pipe(
            map(({ email }) => {
              const redirectTo = 'start-login';
              const tree = this.router.parseUrl(redirectTo);
              tree.queryParams = {
                redirectUrl: window.location.origin + state.url,
                email,
              };
              return tree;
            }),
          );
        } else {
          return this.regulatorUsersRegistrationService
            .acceptRegulatorInvitationAndRegister({ token })
            .pipe(map(() => true));
        }
      }),
      catchError((res: unknown) => {
        if (isBadRequest(res)) {
          this.router.navigate(['invitation/regulator/invalid-link'], {
            queryParams: { code: res.error.code },
          });

          return of(false);
        } else {
          return throwError(() => res);
        }
      }),
      first(),
    );
  }
}

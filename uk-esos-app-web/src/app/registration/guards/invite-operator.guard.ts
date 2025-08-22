import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot, UrlSerializer } from '@angular/router';

import { catchError, combineLatest, first, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore, selectAuthenticationStatus, selectIsLoggedIn } from '@core/store';
import { isBadRequest } from '@error/business-errors';

import { OperatorInvitedUserInfoDTO, OperatorUsersRegistrationService, UserTokenService } from 'esos-api';

import { UserRegistrationStore } from '../store/user-registration.store';

@Injectable({ providedIn: 'root' })
export class InviteOperatorGuard implements Resolve<OperatorInvitedUserInfoDTO> {
  private operatorInvitedUserInfoDTO: OperatorInvitedUserInfoDTO;

  constructor(
    private readonly authStore: AuthStore,
    private readonly router: Router,
    private readonly operatorUsersRegistrationService: OperatorUsersRegistrationService,
    private readonly userTokenService: UserTokenService,
    private readonly store: UserRegistrationStore,
    private readonly authService: AuthService,
    private urlSerializer: UrlSerializer,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const urlTree = this.urlSerializer.parse(state.url);

    const token = urlTree.queryParams['token'];
    if (!token) {
      this.router.navigate(['/registration/invitation/invalid-link']);
      return of(false);
    }

    return this.authService.checkUser().pipe(
      switchMap(() =>
        combineLatest([this.authStore.pipe(selectIsLoggedIn), this.authStore.pipe(selectAuthenticationStatus)]),
      ),
      switchMap(([isLoggedIn, authenticationStatus]) => {
        if (!isLoggedIn) {
          return this.userTokenService.resolveEmailByToken({ token, type: 'OPERATOR_INVITATION' }).pipe(
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
        }

        this.store.setState({
          ...this.store.getState(),
          token,
          isInvited: true,
        });

        if (authenticationStatus !== 'REGISTERED') {
          this.router.navigate(['registration/register']);
          return of(false);
        } else {
          return this.operatorUsersRegistrationService.acceptOperatorInvitation({ token }).pipe(
            tap((operatorInvitedUserInfoDTO) => (this.operatorInvitedUserInfoDTO = operatorInvitedUserInfoDTO)),
            map(() => true),
          );
        }
      }),
      catchError((res: unknown) => {
        if (isBadRequest(res)) {
          this.router.navigate(['/registration/invitation/invalid-link'], {
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

  resolve(): OperatorInvitedUserInfoDTO {
    return this.operatorInvitedUserInfoDTO;
  }
}

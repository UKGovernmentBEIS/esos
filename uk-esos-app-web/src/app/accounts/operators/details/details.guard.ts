import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, UrlTree } from '@angular/router';

import { first, map, Observable, switchMap, tap } from 'rxjs';

import { AuthStore, selectUserState } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';

import { ApplicationUserDTO, OperatorUserDTO, OperatorUsersService, UsersService } from 'esos-api';

import { viewNotFoundOperatorError } from '../errors/business-error';

@Injectable({ providedIn: 'root' })
export class DetailsGuard implements CanActivate, Resolve<OperatorUserDTO | ApplicationUserDTO> {
  private userData: OperatorUserDTO | ApplicationUserDTO;

  constructor(
    private readonly operatorService: OperatorUsersService,
    private readonly usersService: UsersService,
    private readonly authStore: AuthStore,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  isOperatorActive(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authStore.pipe(
      selectUserState,
      first(),
      switchMap(({ userId }) =>
        userId === route.paramMap.get('userId')
          ? this.usersService.getCurrentUser()
          : this.operatorService.getOperatorUserById(
              Number(route.paramMap.get('accountId')),
              route.paramMap.get('userId'),
            ),
      ),
      tap((userData) => (this.userData = userData)),
      map((res) => !!res),
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.isOperatorActive(route).pipe(
      catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
        this.businessErrorService.showError(viewNotFoundOperatorError(Number(route.paramMap.get('accountId')))),
      ),
    );
  }

  resolve(): OperatorUserDTO | ApplicationUserDTO {
    return this.userData;
  }
}

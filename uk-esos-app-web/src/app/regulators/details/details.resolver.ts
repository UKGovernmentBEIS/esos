import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { first, Observable, switchMap } from 'rxjs';

import { AuthStore, selectUserId } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';

import { RegulatorUserDTO, RegulatorUsersService, UsersService } from 'esos-api';

import { viewNotFoundRegulatorError } from '../errors/business-error';

@Injectable({ providedIn: 'root' })
export class DetailsResolver implements Resolve<RegulatorUserDTO> {
  constructor(
    private readonly regulatorUsersService: RegulatorUsersService,
    private readonly usersService: UsersService,
    private readonly authStore: AuthStore,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<RegulatorUserDTO> {
    return this.authStore.pipe(
      selectUserId,
      first(),
      switchMap((userId) =>
        userId === route.paramMap.get('userId')
          ? this.usersService.getCurrentUser()
          : this.regulatorUsersService.getRegulatorUserByCaAndId(route.paramMap.get('userId')),
      ),
      catchBadRequest(ErrorCodes.AUTHORITY1003, () => this.businessErrorService.showError(viewNotFoundRegulatorError)),
    );
  }
}

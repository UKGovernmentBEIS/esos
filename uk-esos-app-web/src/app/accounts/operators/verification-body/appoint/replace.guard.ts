import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchElseRethrow } from '@error/business-errors';
import { HttpStatuses } from '@error/http-status';

import { AccountVerificationBodyService, VerificationBodyNameInfoDTO } from 'esos-api';

import { viewNotFoundOperatorError } from '../../errors/business-error';

@Injectable({ providedIn: 'root' })
export class ReplaceGuard implements CanActivate {
  private verificationBodyNameInfo: VerificationBodyNameInfoDTO;

  constructor(
    private readonly accountVerificationBodyService: AccountVerificationBodyService,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const accountId = Number(route.paramMap.get('accountId'));

    return this.accountVerificationBodyService.getVerificationBodyOfAccount(accountId).pipe(
      tap((res) => (this.verificationBodyNameInfo = res)),
      map(() => true),
      catchElseRethrow(
        (error) => error.status === HttpStatuses.NotFound,
        () => this.businessErrorService.showError(viewNotFoundOperatorError(accountId)),
      ),
    );
  }

  resolve(): VerificationBodyNameInfoDTO {
    return this.verificationBodyNameInfo;
  }
}

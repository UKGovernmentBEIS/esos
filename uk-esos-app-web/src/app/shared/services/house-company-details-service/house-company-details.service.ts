import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { catchError, map, Observable, of, throwError } from 'rxjs';

import { catchNotFoundRequest, ErrorCode } from '@error/not-found-error';
import {
  organisationCompaniesHouseApiMessageServiceUnavailableError,
  organisationCompaniesHouseApiMessageUnauthorizedError,
  organisationCompaniesHouseNotExistsMessageError,
} from '@shared/errors/organisation-companies-house-business-error';

import { CompaniesInformationService, CompanyProfileDTO } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class HouseCompanyDetailsService {
  constructor(private readonly companiesInformationService: CompaniesInformationService) {}

  getCompanyProfile(referenceNumber: string): Observable<CompanyProfileDTO> {
    return this.companiesInformationService.getCompanyProfileByRegistrationNumber(referenceNumber).pipe(
      map((res) => res),
      catchError(() => of({})),
    );
  }

  checkCompanyReferenceNumber(referenceNumber: string): Observable<ValidationErrors | null> {
    return this.companiesInformationService.getCompanyProfileByRegistrationNumber(referenceNumber).pipe(
      map((res) => (res ? null : { companiesHouseNotExists: organisationCompaniesHouseNotExistsMessageError })),
      catchNotFoundRequest(ErrorCode.NOTFOUND1001, () =>
        of({ companiesHouseNotExists: organisationCompaniesHouseNotExistsMessageError }),
      ),
      catchError((err) => {
        switch (err.error.code) {
          case 'COMPANYINFO1001':
          case 'COMPANYINFO1003':
            return of({ companiesHouseNotExists: organisationCompaniesHouseApiMessageServiceUnavailableError });
          case 'COMPANYINFO1002':
            return of({ companiesHouseNotExists: organisationCompaniesHouseApiMessageUnauthorizedError });
          default:
            return throwError(() => err);
        }
      }),
    );
  }
}

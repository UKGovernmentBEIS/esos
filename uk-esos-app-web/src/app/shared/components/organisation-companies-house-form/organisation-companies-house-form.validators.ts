import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { map, Observable } from 'rxjs';

import { accountRegistrationNumberExistsMessageError } from '@shared/errors/organisation-account-application-business-error';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';

import { OrganisationAccountsService } from 'esos-api';

export const registrationNumberNotExists = (accountsService: OrganisationAccountsService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>
    accountsService
      .isExistingAccountRegistrationNumber(control.value)
      .pipe(map((res) => (res ? { registrationNumberExists: accountRegistrationNumberExistsMessageError } : null)));
};

export const companiesHouseNumberExists = (
  houseCompanyDetailsService: HouseCompanyDetailsService,
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>
    houseCompanyDetailsService.checkCompanyReferenceNumber(control.value);
};

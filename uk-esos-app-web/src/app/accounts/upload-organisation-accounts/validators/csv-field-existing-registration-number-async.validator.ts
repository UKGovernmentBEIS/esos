import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';

import { catchError, map, Observable, of, take } from 'rxjs';

import { organisationAccountsCsvMap } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.map';

import {
  OnboardingRegistrationNumbersDTO,
  OrganisationAccountOnboardingRegistriesService,
  OrganisationAccountOnboardingRegistryDTO,
} from 'esos-api';

/**
 * Validates 'registrationNumber' FormControl within a FormArray, against existing registration number found in API
 * Returns the column and row the error was found at
 */
export function csvFieldExistingRegistrationNumberAsyncValidator(
  message: string,
  registriesService: OrganisationAccountOnboardingRegistriesService,
): AsyncValidatorFn {
  return (control: FormControl): Observable<ValidationErrors | null> => {
    const data = control.value as OrganisationAccountOnboardingRegistryDTO[];
    if (!Array.isArray(data)) {
      return null;
    }

    const inputRegistrationNumbers = data.map((row) => row?.registrationNumber);

    const cachedVerifiedRegistrationNumbers$ = registriesService
      .getExistingVerifiedRegistrationNumbers({
        registrationNumbers: inputRegistrationNumbers,
      })
      .pipe(
        take(1),
        catchError((error) => of({ error })),
      );

    return cachedVerifiedRegistrationNumbers$.pipe(
      map((result: OnboardingRegistrationNumbersDTO) => {
        const errorMessageRows = [];
        data?.forEach((entry, index) => {
          if (result?.registrationNumbers?.includes(entry?.registrationNumber)) {
            errorMessageRows.push({
              rowIndex: index + 1,
            });
          }
        });

        if (errorMessageRows.length > 0) {
          const columnHeader = organisationAccountsCsvMap.registrationNumber;
          return {
            ['csvFieldExistingRegistrationNumberSystem']: {
              rows: errorMessageRows,
              columns: [columnHeader],
              message,
            },
          };
        }

        return null;
      }),
    );
  };
}

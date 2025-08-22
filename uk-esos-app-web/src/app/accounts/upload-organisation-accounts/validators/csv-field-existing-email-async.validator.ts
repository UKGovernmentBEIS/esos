import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms';

import { catchError, map, Observable, of, take } from 'rxjs';

import { organisationAccountsCsvMap } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.map';

import {
  OnboardingEmailsDTO,
  OrganisationAccountOnboardingRegistriesService,
  OrganisationAccountOnboardingRegistryDTO,
} from 'esos-api';

/**
 * Validates 'email' FormControl within a FormArray, against existing emails found in API
 * Returns the column and row the error was found at
 */
export function csvFieldExistingEmailAsyncValidator(
  message: string,
  registriesService: OrganisationAccountOnboardingRegistriesService,
): AsyncValidatorFn {
  return (control: FormControl): Observable<ValidationErrors | null> => {
    const data = control.value as OrganisationAccountOnboardingRegistryDTO[];
    if (!Array.isArray(data)) {
      return null;
    }

    const inputEmails = data.map((row) => row?.email);

    const cachedVerifiedEmails$ = registriesService
      .getExistingVerifiedEmails({
        emails: inputEmails,
      })
      .pipe(
        take(1),
        catchError((error) => of({ error })),
      );

    return cachedVerifiedEmails$.pipe(
      map((result: OnboardingEmailsDTO) => {
        const errorMessageRows = [];
        data?.forEach((entry, index) => {
          if (result?.emails?.includes(entry?.email?.toLocaleLowerCase())) {
            errorMessageRows.push({
              rowIndex: index + 1,
            });
          }
        });

        if (errorMessageRows.length > 0) {
          const columnHeader = organisationAccountsCsvMap.email;
          return {
            ['csvFieldExistingEmailSystem']: {
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

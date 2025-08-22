import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { first, tap } from 'rxjs';

import { OrganisationAccountStore } from '@accounts/organisation-account-application/+state';

import { OnboardingRegistrationNumberDTO, OrganisationAccountOnboardingRegistriesService } from 'esos-api';

export const resolveRegistrationNumber: ResolveFn<OnboardingRegistrationNumberDTO> = () => {
  const organisationAccountOnboardingRegistriesService = inject(OrganisationAccountOnboardingRegistriesService);
  const store = inject(OrganisationAccountStore);

  return organisationAccountOnboardingRegistriesService.getCurrentUserVerifiedRegistrationNumber().pipe(
    first(),
    tap((registrationNumber) => {
      if ((registrationNumber as OnboardingRegistrationNumberDTO)?.registrationNumber) {
        store.setRegistrationStatus(true);
        store.setRegistrationNumber((registrationNumber as OnboardingRegistrationNumberDTO).registrationNumber);
      }
    }),
  );
};

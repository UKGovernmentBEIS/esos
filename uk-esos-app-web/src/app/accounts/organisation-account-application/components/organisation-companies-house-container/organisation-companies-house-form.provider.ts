import { UntypedFormBuilder } from '@angular/forms';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import {
  companiesHouseNumberExists,
  registrationNumberNotExists,
} from '@shared/components/organisation-companies-house-form/organisation-companies-house-form.validators';
import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';

import { GovukValidators } from 'govuk-components';

import { OrganisationAccountsService } from 'esos-api';

export const organisationCompaniesHouseFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [
    UntypedFormBuilder,
    ORGANISATION_ACCOUNT_STATE_PROVIDER,
    OrganisationAccountsService,
    HouseCompanyDetailsService,
  ],
  useFactory: (
    fb: UntypedFormBuilder,
    stateProvider: OrganisationAccountStateProvider,
    accountsService: OrganisationAccountsService,
    houseCompanyDetailsService: HouseCompanyDetailsService,
  ) => {
    const registrationNumber = stateProvider?.registrationNumber ?? '';
    return fb.group({
      registrationNumberExist: [
        stateProvider?.registrationStatus,
        GovukValidators.required('Select yes if the organisation is registered at Companies House'),
      ],
      registrationNumber: [
        { value: registrationNumber, disabled: registrationNumber === '' },
        [
          GovukValidators.required('Enter the registration number'),
          GovukValidators.pattern('^[a-zA-Z0-9]{8}$', 'The registration number must be 8 characters'),
          GovukValidators.minLength(8, 'If your Company Registration Number has fewer than 8 numbers, add zeroes at the start'),
        ],
        [registrationNumberNotExists(accountsService), companiesHouseNumberExists(houseCompanyDetailsService)],
      ],
    });
  },
};

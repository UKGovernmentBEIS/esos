import { InjectionToken } from '@angular/core';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

export interface OrganisationAccountStateProvider {
  name: string;
  competentAuthority: OrganisationAccountDTO['competentAuthority'];
  address: CountyAddressDTO;
  registrationStatus?: boolean;
  registrationNumber?: string;
  type: OrganisationAccountDTO['type'];
  otherTypeName?: OrganisationAccountDTO['otherTypeName'];
  codes: OrganisationAccountDTO['codes'];
}

export const ORGANISATION_ACCOUNT_STATE_PROVIDER = new InjectionToken<OrganisationAccountStateProvider>(
  'Organisation account state provider',
);

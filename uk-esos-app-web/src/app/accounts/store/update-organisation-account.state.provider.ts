import { Injectable } from '@angular/core';

import { OrganisationAccountStateProvider } from '@shared/providers/organisation-account.state.provider';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

import { AccountsStore } from './accounts.store';

@Injectable()
export class UpdateOrganisationAccountStateProvider implements OrganisationAccountStateProvider {
  constructor(private readonly store: AccountsStore) {}

  get name(): string {
    return this.store.getState().selectedAccount.name;
  }

  get competentAuthority(): OrganisationAccountDTO['competentAuthority'] {
    return this.store.getState().selectedAccount.competentAuthority;
  }

  get address(): CountyAddressDTO {
    return {
      line1: this.store.getState().selectedAccount.line1,
      line2: this.store.getState().selectedAccount.line2,
      city: this.store.getState().selectedAccount.city,
      county: this.store.getState().selectedAccount.county,
      postcode: this.store.getState().selectedAccount.postcode,
    };
  }

  get registrationNumber(): string {
    return this.store.getState().selectedAccount.registrationNumber;
  }

  get type(): OrganisationAccountDTO['type'] {
    return this.store.getState().selectedAccount.type;
  }

  get codes(): OrganisationAccountDTO['codes'] {
    return this.store.getState().selectedAccount.codes;
  }

  get otherTypeName(): OrganisationAccountDTO['otherTypeName'] {
    return this.store.getState().selectedAccount.otherTypeName;
  }
}

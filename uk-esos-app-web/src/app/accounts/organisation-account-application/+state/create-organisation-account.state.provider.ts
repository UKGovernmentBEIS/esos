import { Injectable } from '@angular/core';

import { OrganisationAccountStateProvider } from '@shared/providers/organisation-account.state.provider';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

import { OrganisationAccountStore } from './organisation-account.store';

@Injectable()
export class CreateOrganisationAccountStateProvider implements OrganisationAccountStateProvider {
  constructor(private readonly store: OrganisationAccountStore) {}

  get name(): string {
    return this.store.state.name;
  }

  get competentAuthority(): OrganisationAccountDTO['competentAuthority'] {
    return this.store.state.competentAuthority;
  }

  get address(): CountyAddressDTO {
    return this.store.state.address;
  }

  get registrationStatus(): boolean {
    return this.store.state.registrationStatus;
  }

  get registrationNumber(): string {
    return this.store.state.registrationNumber;
  }

  get type(): OrganisationAccountDTO['type'] {
    return this.store.state.type;
  }

  get codes(): OrganisationAccountDTO['codes'] {
    return this.store.state.codes;
  }

  get otherTypeName(): OrganisationAccountDTO['otherTypeName'] {
    return this.store.state.otherTypeName;
  }
}

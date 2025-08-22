import { Injectable } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state/request-task.store';
import { OrganisationAccountStateProvider } from '@shared/providers/organisation-account.state.provider';
import { organisationAccountReviewQuery } from '@tasks/organisation-account-application-review/+state/organisation-account-application-review.selectors';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

@Injectable()
export class OrganisationAccountApplicationReviewStateProvider implements OrganisationAccountStateProvider {
  constructor(private readonly store: RequestTaskStore) {}

  get name(): string {
    return this.store.select(organisationAccountReviewQuery.selectName)();
  }

  get competentAuthority(): OrganisationAccountDTO['competentAuthority'] {
    return this.store.select(organisationAccountReviewQuery.selectCompetentAuthority)();
  }

  get address(): CountyAddressDTO {
    return this.store.select(organisationAccountReviewQuery.selectAddress)();
  }

  get registrationStatus(): boolean {
    return this.store.select(organisationAccountReviewQuery.selectRegistrationStatus)();
  }

  get registrationNumber(): string {
    return this.store.select(organisationAccountReviewQuery.selectRegistrationNumber)();
  }

  get type(): OrganisationAccountDTO['type'] {
    return this.store.select(organisationAccountReviewQuery.selectType)();
  }

  get otherTypeName(): OrganisationAccountDTO['otherTypeName'] {
    return this.store.select(organisationAccountReviewQuery.selectOtherTypeName)();
  }

  get codes(): OrganisationAccountDTO['codes'] {
    return this.store.select(organisationAccountReviewQuery.selectCodes)();
  }
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SignalStore } from '@common/store';
import produce from 'immer';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

import { initialState, OrganisationAccountOpeningApplicationState } from './organisation-account.state';

@Injectable({ providedIn: 'root' })
export class OrganisationAccountStore extends SignalStore<OrganisationAccountOpeningApplicationState> {
  constructor() {
    super(initialState);
  }

  get state$(): Observable<OrganisationAccountOpeningApplicationState> {
    return this.rxSelect((state) => state);
  }

  setRegistrationStatus(registrationStatus: boolean) {
    this.setState(
      produce(this.state, (state) => {
        state.registrationStatus = registrationStatus;
      }),
    );
  }

  setRegistrationNumber(registrationNumber: string) {
    this.setState(
      produce(this.state, (state) => {
        state.registrationNumber = registrationNumber;
      }),
    );
  }

  setRegisteredName(name: string) {
    this.setState(
      produce(this.state, (state) => {
        state.name = name;
      }),
    );
  }

  setType(type: OrganisationAccountDTO['type']) {
    this.setState(
      produce(this.state, (state) => {
        state.type = type;
      }),
    );
  }

  setOtherTypeName(otherTypeName: OrganisationAccountDTO['otherTypeName']) {
    this.setState(
      produce(this.state, (state) => {
        state.otherTypeName = otherTypeName;
      }),
    );
  }

  setCodes(codes: OrganisationAccountDTO['codes']) {
    this.setState(
      produce(this.state, (state) => {
        state.codes = codes;
      }),
    );
  }

  setAddress(address: CountyAddressDTO): void {
    this.setState(
      produce(this.state, (state) => {
        state.address = address;
      }),
    );
  }

  setLocation(competentAuthority: OrganisationAccountDTO['competentAuthority']) {
    this.setState(
      produce(this.state, (state) => {
        state.competentAuthority = competentAuthority;
      }),
    );
  }
}

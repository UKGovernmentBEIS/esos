import { signal } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
  initialState,
  OrganisationAccountOpeningApplicationState,
} from '../organisation-account-application/+state/organisation-account.state';

export const mockCreateOrganisationAccountStore = {
  _state: new BehaviorSubject<OrganisationAccountOpeningApplicationState>(initialState),

  get state() {
    return this._state.value;
  },

  get state$() {
    return this._state.asObservable();
  },

  get stateAsSignal() {
    return signal(this._state.value);
  },

  setRegistrationStatus: jest.fn((registrationStatus: boolean) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, registrationStatus };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setRegistrationNumber: jest.fn((registrationNumber: string) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, registrationNumber };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setRegisteredName: jest.fn((name: string) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, name };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setType: jest.fn((type: string) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, type };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setOtherTypeName: jest.fn((otherTypeName: string) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, otherTypeName };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setCodes: jest.fn((codes: string[]) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, codes };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setAddress: jest.fn((address) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, address };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setLocation: jest.fn((competentAuthority) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, competentAuthority };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),

  setSelectedAccount: jest.fn((selectedAccount) => {
    const updatedState = { ...mockCreateOrganisationAccountStore.state, selectedAccount };
    mockCreateOrganisationAccountStore._state.next(updatedState);
  }),
};

import { signal } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { OrganisationAccountDTO } from 'esos-api';

import { mockedOrganisationAccount } from './mock-data';

export const mockUpdateOrganisationAccountStore = {
  _state: new BehaviorSubject<OrganisationAccountDTO>(mockedOrganisationAccount),

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
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, registrationStatus };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setRegistrationNumber: jest.fn((registrationNumber: string) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, registrationNumber };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setRegisteredName: jest.fn((name: string) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, name };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setType: jest.fn((type: string) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, type };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setOtherTypeName: jest.fn((otherTypeName: string) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, otherTypeName };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setCodes: jest.fn((codes: string[]) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, codes };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setAddress: jest.fn((address) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, address };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),

  setLocation: jest.fn((competentAuthority) => {
    const updatedState = { ...mockUpdateOrganisationAccountStore.state, competentAuthority };
    mockUpdateOrganisationAccountStore._state.next(updatedState);
  }),
};

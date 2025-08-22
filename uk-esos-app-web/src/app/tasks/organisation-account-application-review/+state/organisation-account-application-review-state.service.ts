import { Injectable } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';
import produce from 'immer';

import {
  CountyAddressDTO,
  OrganisationAccountDTO,
  OrganisationAccountOpeningApplicationRequestTaskPayload,
} from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class OrganisationAccountApplicationReviewStateService {
  constructor(private store: RequestTaskStore) {}

  get payload(): OrganisationAccountOpeningApplicationRequestTaskPayload {
    return this.store.state.requestTaskItem.requestTask
      .payload as OrganisationAccountOpeningApplicationRequestTaskPayload;
  }

  setRegistrationNumber(registrationNumber: string) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.registrationNumber = registrationNumber;
      }),
    );
  }

  setRegisteredName(registeredName: string) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.name = registeredName;
      }),
    );
  }

  setType(type: OrganisationAccountDTO['type']) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.type = type;
      }),
    );
  }

  setOtherTypeName(otherTypeName: OrganisationAccountDTO['otherTypeName']) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.otherTypeName = otherTypeName;
      }),
    );
  }

  setCodes(codes: OrganisationAccountDTO['codes']) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.codes = codes;
      }),
    );
  }

  setAddress(address: CountyAddressDTO) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.line1 = address.line1;
        payload.account.line2 = address.line2;
        payload.account.city = address.city;
        payload.account.county = address.county;
        payload.account.postcode = address.postcode;
      }),
    );
  }

  setLocation(location: OrganisationAccountDTO['competentAuthority']) {
    this.store.setState(
      produce(this.store.state, (state) => {
        const payload = state.requestTaskItem.requestTask.payload as any;
        payload.account.location = location;
      }),
    );
  }
}

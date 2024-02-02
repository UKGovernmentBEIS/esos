import { Injectable } from '@angular/core';

import { SignalStore } from '@common/store';
import produce from 'immer';

import { RequestActionDTO, RequestActionPayload } from 'esos-api';

import { initialState, RequestActionState } from './request-action.state';

@Injectable({ providedIn: 'root' })
export class RequestActionStore extends SignalStore<RequestActionState> {
  constructor() {
    super(initialState);
  }

  setAction(action: RequestActionDTO) {
    this.setState(
      produce(this.state, (state) => {
        state.action = action;
      }),
    );
  }

  setSubmitter(submitter: string) {
    this.setState(
      produce(this.state, (state) => {
        state.action.submitter = submitter;
      }),
    );
  }

  setType(type: RequestActionDTO['type']) {
    this.setState(
      produce(this.state, (state) => {
        state.action.type = type;
      }),
    );
  }

  setPayload(payload: RequestActionPayload) {
    this.setState(
      produce(this.state, (state) => {
        state.action.payload = payload;
      }),
    );
  }
}

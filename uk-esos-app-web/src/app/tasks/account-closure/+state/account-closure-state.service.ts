import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';

import { AccountClosureTaskPayload } from '../account-closure.types';

@Injectable({ providedIn: 'root' })
export class AccountClosureStateService extends TaskStateService<AccountClosureTaskPayload> {
  private stagedPayload: AccountClosureTaskPayload;

  get payload(): AccountClosureTaskPayload {
    return this.store.state.requestTaskItem.requestTask.payload;
  }

  get stagedChanges(): AccountClosureTaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: AccountClosureTaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: AccountClosureTaskPayload): void {
    this.store.setPayload(payload);
  }
}

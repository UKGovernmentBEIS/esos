import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';

import { ProgressUpdate1TaskPayload } from '../progress-update-1.types';

@Injectable()
export class ProgressUpdate1StateService extends TaskStateService<ProgressUpdate1TaskPayload> {
  private stagedPayload: ProgressUpdate1TaskPayload;

  get payload(): ProgressUpdate1TaskPayload {
    return this.store.state.requestTaskItem.requestTask.payload;
  }

  get stagedChanges(): ProgressUpdate1TaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: ProgressUpdate1TaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: ProgressUpdate1TaskPayload): void {
    this.store.setPayload(payload);
  }
}

import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';

import { ProgressUpdate2TaskPayload } from '../progress-update-2.types';

@Injectable()
export class ProgressUpdate2StateService extends TaskStateService<ProgressUpdate2TaskPayload> {
  private stagedPayload: ProgressUpdate2TaskPayload;

  get payload(): ProgressUpdate2TaskPayload {
    return this.store.state.requestTaskItem.requestTask.payload;
  }

  get stagedChanges(): ProgressUpdate2TaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: ProgressUpdate2TaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: ProgressUpdate2TaskPayload): void {
    this.store.setPayload(payload);
  }
}

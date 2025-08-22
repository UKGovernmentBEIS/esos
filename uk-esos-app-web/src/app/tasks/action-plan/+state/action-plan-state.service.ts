import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';

import { ActionPlanTaskPayload } from '../action-plan.types';

@Injectable()
export class ActionPlanStateService extends TaskStateService<ActionPlanTaskPayload> {
  private stagedPayload: ActionPlanTaskPayload;

  get payload(): ActionPlanTaskPayload {
    return this.store.state.requestTaskItem.requestTask.payload;
  }

  get stagedChanges(): ActionPlanTaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: ActionPlanTaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: ActionPlanTaskPayload): void {
    this.store.setPayload(payload);
  }
}

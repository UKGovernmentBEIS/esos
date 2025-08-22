import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskApiService, TaskApiServiceExtended } from '@common/forms/services/task-api.service';
import { TaskStateService } from '@common/forms/services/task-state.service';
import { SideEffectsHandler } from '@common/forms/side-effects';
import { StepFlowManager } from '@common/forms/step-flow';
import { STEP_FLOW_MANAGERS } from '@common/forms/step-flow/step-flow.providers';

import { RequestTaskPayload } from 'esos-api';

export type SaveConfig<T extends RequestTaskPayload> = {
  subtask: string;
  payload: T;
  currentStep: string;
  route: ActivatedRoute;
  applySideEffects?: boolean;
};

export type SubmitConfig<T extends RequestTaskPayload> = Omit<SaveConfig<T>, 'payload'>;

export type SendToRestrictedConfig = {
  subtask: string;
  userId: string;
  data?: any;
  currentStep: string;
  route: ActivatedRoute;
};

export abstract class TaskService<T extends RequestTaskPayload> {
  protected stateService = inject(TaskStateService);
  protected apiService = inject(TaskApiService);
  protected sideEffects = inject(SideEffectsHandler);
  protected stepFlowManagers: StepFlowManager[] = inject(STEP_FLOW_MANAGERS);

  abstract get payload(): T;

  abstract saveSubtask(config: SaveConfig<T>): void;
  abstract submitSubtask(config: SaveConfig<T>): void;
  abstract submit(config: SubmitConfig<T>): void;
}

export abstract class TaskServiceExtended<T extends RequestTaskPayload> extends TaskService<T> {
  protected apiService = inject(TaskApiServiceExtended);

  abstract returnToSubmit(config: SubmitConfig<T>): void;
  abstract sendToRestricted(config: SendToRestrictedConfig): void;
}

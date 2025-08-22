import { Injectable } from '@angular/core';

import {
  SaveConfig,
  SendToRestrictedConfig,
  SubmitConfig,
  TaskServiceExtended,
} from '@common/forms/services/task.service';
import { StepFlowManager } from '@common/forms/step-flow';
import { TaskItemStatus } from '@tasks/task-item-status';

import { NotificationTaskPayload } from '../notification.types';

export type NotificationSaveConfig = SaveConfig<NotificationTaskPayload>;
export type NotificationSubmitConfig = SubmitConfig<NotificationTaskPayload>;

@Injectable()
export class NotificationService extends TaskServiceExtended<NotificationTaskPayload> {
  saveSubtask(config: NotificationSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.IN_PROGRESS);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  get payload(): NotificationTaskPayload {
    return this.stateService.payload;
  }

  submitSubtask(config: NotificationSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.COMPLETED);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  returnToSubmit(config: NotificationSubmitConfig) {
    const { subtask, currentStep, route } = config;

    this.apiService.returnToSubmit().subscribe(() => {
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  sendToRestricted(config: SendToRestrictedConfig) {
    const { subtask, userId, data, currentStep, route } = config;

    this.apiService
      .sendToRestricted(userId)
      .subscribe(() => this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route, data));
  }

  submit(config: NotificationSaveConfig): void {
    const { subtask, currentStep, route } = config;

    this.apiService.submit().subscribe(() => {
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  private stageAndApplySideEffects(
    subtask: string,
    step: string,
    payload: NotificationTaskPayload,
    applySideEffects: boolean,
    taskStatus: TaskItemStatus,
  ): void {
    const updatedPayload = {
      ...payload,
      nocSectionsCompleted: {
        ...payload?.nocSectionsCompleted,
        [subtask]: taskStatus,
      },
    };

    this.stateService.stageForSave(
      applySideEffects !== false ? this.sideEffects.apply(subtask, step, updatedPayload) : updatedPayload,
    );
  }

  private flowManagerForSubtask(subtask: string): StepFlowManager {
    const flowManager = this.stepFlowManagers.find((sfm) => sfm.subtask === subtask) ?? null;
    if (!flowManager) {
      console.error(`###NotificationService### :: Could not find StepFlowManager for subtask: ${subtask}`);
    }
    return flowManager;
  }
}

import { Injectable } from '@angular/core';

import { SaveConfig, TaskService } from '@common/forms/services/task.service';
import { StepFlowManager } from '@common/forms/step-flow';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ActionPlanTaskPayload } from '../action-plan.types';

export type ActionPlanSaveConfig = SaveConfig<ActionPlanTaskPayload>;

@Injectable()
export class ActionPlanService extends TaskService<ActionPlanTaskPayload> {
  saveSubtask(config: ActionPlanSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.IN_PROGRESS);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  get payload(): ActionPlanTaskPayload {
    return this.stateService.payload;
  }

  submitSubtask(config: ActionPlanSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.COMPLETED);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  submit(config: ActionPlanSaveConfig): void {
    const { subtask, currentStep, route } = config;

    this.apiService.submit().subscribe(() => {
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  private stageAndApplySideEffects(
    subtask: string,
    step: string,
    payload: ActionPlanTaskPayload,
    applySideEffects: boolean,
    taskStatus: TaskItemStatus,
  ): void {
    const updatedPayload = {
      ...payload,
      actionPlanSectionsCompleted: {
        ...payload?.actionPlanSectionsCompleted,
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
      console.error(`###ActionPlanService### :: Could not find StepFlowManager for subtask: ${subtask}`);
    }
    return flowManager;
  }
}

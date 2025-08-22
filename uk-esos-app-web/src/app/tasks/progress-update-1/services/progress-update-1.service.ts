import { Injectable } from '@angular/core';

import { SaveConfig, TaskService } from '@common/forms/services/task.service';
import { StepFlowManager } from '@common/forms/step-flow';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ProgressUpdate1TaskPayload } from '../progress-update-1.types';

export type ProgressUpdate1SaveConfig = SaveConfig<ProgressUpdate1TaskPayload>;

@Injectable()
export class ProgressUpdate1Service extends TaskService<ProgressUpdate1TaskPayload> {
  saveSubtask(config: ProgressUpdate1SaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.IN_PROGRESS);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  get payload(): ProgressUpdate1TaskPayload {
    return this.stateService.payload;
  }

  submitSubtask(config: ProgressUpdate1SaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.COMPLETED);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  submit(config: ProgressUpdate1SaveConfig): void {
    const { subtask, currentStep, route } = config;

    this.apiService.submit().subscribe(() => this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route));
  }

  private stageAndApplySideEffects(
    subtask: string,
    step: string,
    payload: ProgressUpdate1TaskPayload,
    applySideEffects: boolean,
    taskStatus: TaskItemStatus,
  ): void {
    const updatedPayload: ProgressUpdate1TaskPayload = {
      ...payload,
      progressUpdate1P3SectionsCompleted: {
        ...payload?.progressUpdate1P3SectionsCompleted,
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
      console.error(`###ProgressUpdate1Service### :: Could not find StepFlowManager for subtask: ${subtask}`);
    }
    return flowManager;
  }
}

import { SideEffect } from '@common/forms/side-effects/side-effect';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { hasOtherEstimationMethod } from '@tasks/progress-update-common/pu-common.helpers';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME } from './pu1-energy-efficiency-measures.helper';

export class ProgressUpdate1EnergyEfficiencyMeasuresSideEffect extends SideEffect {
  subtask = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  apply<T extends ProgressUpdate1TaskPayload>(payload: T): T {
    const isSecondConfirmationRequiredOld = hasOtherEstimationMethod(
      this.store.select(progressUpdate1Query.selectProgressUpdate)(),
    );
    const isSecondConfirmationRequiredNew = hasOtherEstimationMethod(payload.progressUpdate1P3);
    const checkedCount = payload.progressUpdate1P3.responsibleOfficerConfirmation?.length ?? 0;

    const updatedPayload = produce(payload, (payload) => {
      if (
        isSecondConfirmationRequiredNew === true &&
        payload.progressUpdate1P3SectionsCompleted?.responsibleOfficerConfirmation &&
        checkedCount !== 2
      ) {
        checkedCount === 1
          ? (payload.progressUpdate1P3SectionsCompleted.responsibleOfficerConfirmation = TaskItemStatus.IN_PROGRESS)
          : delete payload.progressUpdate1P3SectionsCompleted.responsibleOfficerConfirmation;
      } else if (
        isSecondConfirmationRequiredOld === true &&
        isSecondConfirmationRequiredNew === false &&
        checkedCount === 2
      ) {
        payload.progressUpdate1P3.responsibleOfficerConfirmation = ['ESOS_ACTION_PLAN_COMPLIANCE'];
      }

      return payload;
    });

    return updatedPayload;
  }
}

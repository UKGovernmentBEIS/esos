import { SideEffect } from '@common/forms/side-effects/side-effect';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { hasOtherEstimationMethod } from '@tasks/progress-update-common/pu-common.helpers';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME } from './pu2-energy-efficiency-measures.helper';

export class ProgressUpdate2EnergyEfficiencyMeasuresSideEffect extends SideEffect {
  subtask = PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  apply<T extends ProgressUpdate2TaskPayload>(payload: T): T {
    const isSecondConfirmationRequiredOld = hasOtherEstimationMethod(
      this.store.select(progressUpdate2Query.selectProgressUpdate)(),
    );
    const isSecondConfirmationRequiredNew = hasOtherEstimationMethod(payload.progressUpdate2P3);
    const checkedCount = payload.progressUpdate2P3.responsibleOfficerConfirmation?.length ?? 0;

    const updatedPayload = produce(payload, (payload) => {
      if (
        isSecondConfirmationRequiredNew === true &&
        payload.progressUpdate2P3SectionsCompleted?.responsibleOfficerConfirmation &&
        checkedCount !== 2
      ) {
        checkedCount === 1
          ? (payload.progressUpdate2P3SectionsCompleted.responsibleOfficerConfirmation = TaskItemStatus.IN_PROGRESS)
          : delete payload.progressUpdate2P3SectionsCompleted.responsibleOfficerConfirmation;
      } else if (
        isSecondConfirmationRequiredOld === true &&
        isSecondConfirmationRequiredNew === false &&
        checkedCount === 2
      ) {
        payload.progressUpdate2P3.responsibleOfficerConfirmation = ['ESOS_ACTION_PLAN_COMPLIANCE'];
      }

      return payload;
    });

    return updatedPayload;
  }
}

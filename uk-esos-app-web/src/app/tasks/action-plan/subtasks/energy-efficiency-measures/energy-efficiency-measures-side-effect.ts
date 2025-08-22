import { SideEffect } from '@common/forms/side-effects/side-effect';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { hasOtherEstimationMethod } from '@tasks/action-plan/action-plan-task-content';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { ActionPlanP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME } from './energy-efficiency-measures.helper';

export class EnergyEfficiencyMeasuresSideEffect extends SideEffect {
  subtask = ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  apply<T extends ActionPlanP3ApplicationSubmitRequestTaskPayload>(payload: T): T {
    const isSecondConfirmationRequiredOld = hasOtherEstimationMethod(
      this.store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)(),
    );
    const isSecondConfirmationRequiredNew = hasOtherEstimationMethod(
      payload.actionPlanP3?.energyEfficiencyMeasure?.energyEfficiencyMeasures,
    );
    const checkedCount = payload.actionPlanP3.responsibleOfficerConfirmation?.length ?? 0;

    const updatedPayload = produce(payload, (payload) => {
      if (
        isSecondConfirmationRequiredNew === true &&
        payload.actionPlanSectionsCompleted?.responsibleOfficerConfirmation &&
        checkedCount !== 2
      ) {
        checkedCount === 1
          ? (payload.actionPlanSectionsCompleted.responsibleOfficerConfirmation = TaskItemStatus.IN_PROGRESS)
          : delete payload.actionPlanSectionsCompleted.responsibleOfficerConfirmation;
      } else if (
        isSecondConfirmationRequiredOld === true &&
        isSecondConfirmationRequiredNew === false &&
        checkedCount === 2
      ) {
        payload.actionPlanP3.responsibleOfficerConfirmation = ['ESOS_ASSESSMENT_NOTIFICATION'];
      }

      return payload;
    });

    return updatedPayload;
  }
}

import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createDescendingSelector, StateSelector } from '@common/store';

import { ActionPlanEnergyEfficiencyMeasure, ActionPlanP3 } from 'esos-api';

import { ActionPlanTaskPayload } from '../action-plan.types';
import { isActionPlanCompleted } from '../action-plan-task-content';

const selectPayload: StateSelector<RequestTaskState, ActionPlanTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as ActionPlanTaskPayload,
);

const selectActionPlanEnergyEfficiencyMeasure: StateSelector<RequestTaskState, ActionPlanEnergyEfficiencyMeasure> =
  createDescendingSelector(selectPayload, (payload) => payload.actionPlanP3?.energyEfficiencyMeasure);

const selectHaveEnergyEfficiencyMeasures: StateSelector<
  RequestTaskState,
  ActionPlanEnergyEfficiencyMeasure['haveEnergyEfficiencyMeasures']
> = createDescendingSelector(
  selectActionPlanEnergyEfficiencyMeasure,
  (actionPlanEnergyEfficiencyMeasure) => actionPlanEnergyEfficiencyMeasure?.haveEnergyEfficiencyMeasures,
);

const selectEnergyEfficiencyMeasures: StateSelector<
  RequestTaskState,
  ActionPlanEnergyEfficiencyMeasure['energyEfficiencyMeasures']
> = createDescendingSelector(
  selectActionPlanEnergyEfficiencyMeasure,
  (actionPlanEnergyEfficiencyMeasure) => actionPlanEnergyEfficiencyMeasure?.energyEfficiencyMeasures,
);

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestTaskState,
  ActionPlanP3['responsibleOfficerConfirmation']
> = createDescendingSelector(selectPayload, (payload) => payload.actionPlanP3?.responsibleOfficerConfirmation);

const selectActionPlanSectionsCompleted: StateSelector<
  RequestTaskState,
  ActionPlanTaskPayload['actionPlanSectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload.actionPlanSectionsCompleted);

const selectCanSubmitActionPlan: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  isActionPlanCompleted,
);

export const actionPlanQuery = {
  selectPayload,
  selectActionPlanEnergyEfficiencyMeasure,
  selectHaveEnergyEfficiencyMeasures,
  selectEnergyEfficiencyMeasures,
  selectResponsibleOfficerConfirmation,
  selectActionPlanSectionsCompleted,
  selectCanSubmitActionPlan,
};

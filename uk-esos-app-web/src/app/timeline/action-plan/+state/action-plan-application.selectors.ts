import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, createSelector, StateSelector } from '@common/store';
import { ActionPlanApplicationTimelinePayload } from '@timeline/action-plan/+state/action-plan-application.types';

import { ActionPlanEnergyEfficiencyMeasure, ActionPlanP3, RequestActionDTO } from 'esos-api';

const selectAction: StateSelector<RequestActionState, RequestActionDTO> = createSelector(
  requestActionQuery.selectAction,
);

const selectPayload: StateSelector<RequestActionState, ActionPlanApplicationTimelinePayload> = createDescendingSelector(
  requestActionQuery.selectActionPayload,
  (state) => state as ActionPlanApplicationTimelinePayload,
);

const selectActionPlanEnergyEfficiencyMeasure: StateSelector<RequestActionState, ActionPlanEnergyEfficiencyMeasure> =
  createDescendingSelector(selectPayload, (payload) => payload.actionPlan?.energyEfficiencyMeasure);

const selectResponsibleOfficerConfirmation: StateSelector<
  RequestActionState,
  ActionPlanP3['responsibleOfficerConfirmation']
> = createDescendingSelector(selectPayload, (payload) => payload.actionPlan?.responsibleOfficerConfirmation);

export const actionPlanApplicationTimelineQuery = {
  selectAction,
  selectPayload,
  selectActionPlanEnergyEfficiencyMeasure,
  selectResponsibleOfficerConfirmation,
};

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';

import { ResponsibleOfficerConfirmationStepUrl } from './responsible-officer-confirmation.helper';
import { isWizardCompleted } from './responsible-officer-confirmation.wizard';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const actionPlan = store.select(actionPlanQuery.selectPayload)().actionPlanP3;

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(actionPlan)) ||
    createUrlTreeFromSnapshot(route, ['./', ResponsibleOfficerConfirmationStepUrl.REVIEW])
  );
};

export const canActivateReview: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const actionPlan = store.select(actionPlanQuery.selectPayload)().actionPlanP3;
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(actionPlan) || change)) ||
    createUrlTreeFromSnapshot(route, [ResponsibleOfficerConfirmationStepUrl.SUMMARY])
  );
};

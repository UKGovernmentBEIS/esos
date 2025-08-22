import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { WizardStep } from './alternative-compliance-routes.helper';
import { isWizardCompleted } from './alternative-compliance-routes.wizard';

export const canActivateAlternativeComplianceRoutes: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const alternativeComplianceRoutes = store.select(notificationQuery.selectAlternativeComplianceRoutes)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(alternativeComplianceRoutes) || change)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY])
  );
};

export const canActivateAlternativeComplianceRoutesSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const alternativeComplianceRoutes = store.select(notificationQuery.selectAlternativeComplianceRoutes)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(alternativeComplianceRoutes)) ||
    createUrlTreeFromSnapshot(route, [WizardStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION])
  );
};

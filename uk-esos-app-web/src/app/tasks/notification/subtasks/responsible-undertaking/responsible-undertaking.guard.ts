import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { ResponsibleUndertakingWizardStep } from './responsible-undertaking.helper';
import { isWizardCompleted } from './responsible-undertaking.wizard';

export const canActivateResponsibleUndertaking: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';

  const responsibleUndertaking = store.select(notificationQuery.selectResponsibleUndertaking)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    (isEditable && (!isWizardCompleted(responsibleUndertaking) || change)) ||
    createUrlTreeFromSnapshot(route, [ResponsibleUndertakingWizardStep.SUMMARY])
  );
};

export const canActivateResponsibleUndertakingSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const responsibleUndertaking = store.select(notificationQuery.selectResponsibleUndertaking)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(responsibleUndertaking)) ||
    createUrlTreeFromSnapshot(route, ['./', ResponsibleUndertakingWizardStep.REGISTRATION_NUMBER])
  );
};

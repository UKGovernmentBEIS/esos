import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';

import { PROGRESS_UPDATE_COMMON_QUERY } from '../+state';
import { isWizardCompleted, ProgressUpdateGroupChangeStepUrl } from './pu-group-change.helper';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const groupChange = store.select(puCommonQuery.selectGroupChange)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(groupChange)) ||
    createUrlTreeFromSnapshot(route, ['./', ProgressUpdateGroupChangeStepUrl.FORM])
  );
};

export const canActivateForm: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const groupChange = store.select(puCommonQuery.selectGroupChange)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(groupChange) || change)) ||
    createUrlTreeFromSnapshot(route, [ProgressUpdateGroupChangeStepUrl.SUMMARY])
  );
};

export const canActivateGroupChange: CanActivateFn = () => {
  const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  const store = inject(RequestTaskStore);
  const isDisaggregateUndertaking = store.select(puCommonQuery.selectIsDisaggregateUndertaking)();

  return isDisaggregateUndertaking;
};

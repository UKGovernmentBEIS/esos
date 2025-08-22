import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdateResponsibleOfficerConfirmationStepUrl } from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import { PROGRESS_UPDATE_COMMON_QUERY } from '../+state';
import { isWizardCompleted } from './pu-responsible-officer-confirmation.wizard';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const progressUpdate = store.select(puCommonQuery.selectProgressUpdate)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(progressUpdate)) ||
    createUrlTreeFromSnapshot(route, ['./', ProgressUpdateResponsibleOfficerConfirmationStepUrl.REVIEW])
  );
};

export const canActivateReview: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const progressUpdate = store.select(puCommonQuery.selectProgressUpdate)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(progressUpdate) || change)) ||
    createUrlTreeFromSnapshot(route, [ProgressUpdateResponsibleOfficerConfirmationStepUrl.SUMMARY])
  );
};

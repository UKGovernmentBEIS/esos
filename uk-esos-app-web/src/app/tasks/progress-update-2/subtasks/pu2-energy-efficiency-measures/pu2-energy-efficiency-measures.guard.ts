import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';

import {
  getNextUpdateForMeasureIndex,
  isWizardCompleted,
  ProgressUpdate2EnergyEfficiencyMeasuresStepUrl,
} from './pu2-energy-efficiency-measures.helper';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate2Query.selectMeasuresForUpdate)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(measures)) ||
    createUrlTreeFromSnapshot(route, [
      `./${getNextUpdateForMeasureIndex(measures)}/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.UPDATE_FOR_MEASURE}`,
    ])
  );
};

export const canActivateUpdateForMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate2Query.selectMeasuresForUpdate)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && !!measures[measureIndex];

  return (
    (isEditable && !isWizardCompleted(measures) && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

export const canActivateEditUpdateForMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate2Query.selectMeasuresForUpdate)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && !!measures[measureIndex];

  return (
    (isEditable && isWizardCompleted(measures) && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

export const canActivateAddNewMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate2Query.selectMeasuresForUpdate)();

  return (
    (isEditable && isWizardCompleted(measures)) ||
    createUrlTreeFromSnapshot(route, [ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY])
  );
};

export const canActivateEditOrRemoveNewMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const newMeasures = store.select(progressUpdate2Query.selectAddedMeasures)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && newMeasures?.length && !!newMeasures[measureIndex];

  return (
    (isEditable && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

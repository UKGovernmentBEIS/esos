import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';

import {
  getNextUpdateForMeasureIndex,
  isWizardCompleted,
  ProgressUpdate1EnergyEfficiencyMeasuresStepUrl,
} from './pu1-energy-efficiency-measures.helper';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate1Query.selectMeasuresForUpdate)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(measures)) ||
    createUrlTreeFromSnapshot(route, [
      `./${getNextUpdateForMeasureIndex(measures)}/${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.UPDATE_FOR_MEASURE}`,
    ])
  );
};

export const canActivateUpdateForMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate1Query.selectMeasuresForUpdate)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && !!measures[measureIndex];

  return (
    (isEditable && !isWizardCompleted(measures) && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

export const canActivateEditUpdateForMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate1Query.selectMeasuresForUpdate)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && !!measures[measureIndex];

  return (
    (isEditable && isWizardCompleted(measures) && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

export const canActivateAddNewMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const measures = store.select(progressUpdate1Query.selectMeasuresForUpdate)();

  return (
    (isEditable && isWizardCompleted(measures)) ||
    createUrlTreeFromSnapshot(route, [ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY])
  );
};

export const canActivateEditOrRemoveNewMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const newMeasures = store.select(progressUpdate1Query.selectAddedMeasures)();
  const measureIndex = route.paramMap.get('measureIndex');
  const measureExists = measureIndex && newMeasures?.length && !!newMeasures[measureIndex];

  return (
    (isEditable && measureExists) ||
    createUrlTreeFromSnapshot(route, [`../${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

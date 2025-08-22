import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';

import { EnergyEfficiencyMeasuresStepUrl } from './energy-efficiency-measures.helper';
import { isWizardCompleted } from './energy-efficiency-measures.wizard';

export const canActivateSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const actionPlanEnergyEfficiencyMeasure = store.select(actionPlanQuery.selectActionPlanEnergyEfficiencyMeasure)();
  const haveEnergyEfficiencyMeasures = actionPlanEnergyEfficiencyMeasure?.haveEnergyEfficiencyMeasures;

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(actionPlanEnergyEfficiencyMeasure)) ||
    createUrlTreeFromSnapshot(route, [
      './',
      haveEnergyEfficiencyMeasures
        ? EnergyEfficiencyMeasuresStepUrl.MEASURE_FORM
        : EnergyEfficiencyMeasuresStepUrl.PROPOSED_MEASURES,
    ])
  );
};

export const canActivateProposedMeasures: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const actionPlanEnergyEfficiencyMeasure = store.select(actionPlanQuery.selectActionPlanEnergyEfficiencyMeasure)();
  const change = route.queryParamMap.get('change') === 'true';

  return (
    (isEditable && (!isWizardCompleted(actionPlanEnergyEfficiencyMeasure) || change)) ||
    createUrlTreeFromSnapshot(route, [EnergyEfficiencyMeasuresStepUrl.SUMMARY])
  );
};

export const canActivateMeasureForm: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const actionPlanEnergyEfficiencyMeasure = store.select(actionPlanQuery.selectActionPlanEnergyEfficiencyMeasure)();
  const haveEnergyEfficiencyMeasures = actionPlanEnergyEfficiencyMeasure?.haveEnergyEfficiencyMeasures;

  return (
    (isEditable && haveEnergyEfficiencyMeasures && !isWizardCompleted(actionPlanEnergyEfficiencyMeasure)) ||
    createUrlTreeFromSnapshot(route, [EnergyEfficiencyMeasuresStepUrl.SUMMARY])
  );
};

export const canActivateAddAnotherMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const haveEnergyEfficiencyMeasures = store.select(actionPlanQuery.selectHaveEnergyEfficiencyMeasures)();

  return (
    (isEditable && haveEnergyEfficiencyMeasures) ||
    createUrlTreeFromSnapshot(route, [EnergyEfficiencyMeasuresStepUrl.SUMMARY])
  );
};

export const canActivateEditOrRemoveMeasure: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const energyEfficiencyMeasures = store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)();
  const measureIndex = route.paramMap.get('measureIndex');
  const canAlter = measureIndex && energyEfficiencyMeasures?.length && !!energyEfficiencyMeasures[measureIndex];

  return (
    (isEditable && canAlter) || createUrlTreeFromSnapshot(route, [`../${EnergyEfficiencyMeasuresStepUrl.SUMMARY}`])
  );
};

import { Routes } from '@angular/router';

import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateAddAnotherMeasure,
  canActivateEditOrRemoveMeasure,
  canActivateMeasureForm,
  canActivateProposedMeasures,
  canActivateSummary,
} from './energy-efficiency-measures.guard';
import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  EnergyEfficiencyMeasuresStepUrl,
} from './energy-efficiency-measures.helper';
import { MEASURE_FORM_CONTENT } from './measure/measure-content';
import { PROPOSED_MEASURES_CONTENT } from './proposed-measures/proposed-measures-content';

export const ENERGY_EFFICIENCY_MEASURES_ROUTES: Routes = [
  {
    path: '',
    title: `${ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}`,
    data: { breadcrumb: `${ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}` },
    children: [
      {
        path: '',
        canActivate: [canActivateSummary],
        loadComponent: () =>
          import('@tasks/action-plan/subtasks/energy-efficiency-measures/summary').then((c) => c.SummaryComponent),
      },
      {
        path: `:measureIndex/${EnergyEfficiencyMeasuresStepUrl.EDIT_MEASURE}`,
        title: MEASURE_FORM_CONTENT.editTitle,
        data: { breadcrumb: 'Edit measure', backlink: '../../' },
        canActivate: [canActivateEditOrRemoveMeasure],
        loadComponent: () =>
          import('@tasks/action-plan/subtasks/energy-efficiency-measures/measure').then((c) => c.MeasureComponent),
      },
      {
        path: `:measureIndex/${EnergyEfficiencyMeasuresStepUrl.REMOVE_MEASURE}`,
        title: 'Remove measure',
        data: { breadcrumb: 'Remove measure', backlink: '../../' },
        canActivate: [canActivateEditOrRemoveMeasure],
        loadComponent: () =>
          import('@tasks/action-plan/subtasks/energy-efficiency-measures/remove-measure').then(
            (c) => c.RemoveMeasureComponent,
          ),
      },
      {
        path: EnergyEfficiencyMeasuresStepUrl.ADD_ANOTHER_MEASURE,
        title: MEASURE_FORM_CONTENT.title,
        data: { breadcrumb: 'Add measure', backlink: '../' },
        canActivate: [canActivateAddAnotherMeasure],
        loadComponent: () =>
          import('@tasks/action-plan/subtasks/energy-efficiency-measures/measure').then((c) => c.MeasureComponent),
      },
    ],
  },
  {
    path: EnergyEfficiencyMeasuresStepUrl.PROPOSED_MEASURES,
    title: PROPOSED_MEASURES_CONTENT.title,
    data: { breadcrumb: `${ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}` },
    resolve: {
      backlink: backlinkResolver(EnergyEfficiencyMeasuresStepUrl.SUMMARY, '../../'),
    },
    canActivate: [canActivateProposedMeasures],
    loadComponent: () =>
      import('@tasks/action-plan/subtasks/energy-efficiency-measures/proposed-measures').then(
        (c) => c.ProposedMeasuresComponent,
      ),
  },
  {
    path: EnergyEfficiencyMeasuresStepUrl.MEASURE_FORM,
    title: MEASURE_FORM_CONTENT.title,
    data: {
      breadcrumb: `${ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}`,
      backlink: `../${EnergyEfficiencyMeasuresStepUrl.PROPOSED_MEASURES}`,
    },
    canActivate: [canActivateMeasureForm],
    loadComponent: () =>
      import('@tasks/action-plan/subtasks/energy-efficiency-measures/measure').then((c) => c.MeasureComponent),
  },
];

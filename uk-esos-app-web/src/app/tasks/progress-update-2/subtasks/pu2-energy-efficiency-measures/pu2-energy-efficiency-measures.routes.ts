import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { NEW_MEASURE_FORM_CONTENT } from './new-measure/new-measure-content';
import {
  canActivateAddNewMeasure,
  canActivateEditOrRemoveNewMeasure,
  canActivateEditUpdateForMeasure,
  canActivateSummary,
  canActivateUpdateForMeasure,
} from './pu2-energy-efficiency-measures.guard';
import {
  ProgressUpdate2EnergyEfficiencyMeasuresStepUrl,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from './pu2-energy-efficiency-measures.helper';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from './update-for-measure/update-for-measure-content';

export const PU2_ENERGY_EFFICIENCY_MEASURES_ROUTES: Routes = [
  {
    path: '',
    title: `${PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}`,
    data: { breadcrumb: `${PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}` },
    children: [
      {
        path: '',
        canActivate: [canActivateSummary],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/summary').then(
            (c) => c.SummaryComponent,
          ),
      },
      {
        path: `:measureIndex/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.UPDATE_FOR_MEASURE}`,
        title: UPDATE_FOR_MEASURE_FORM_CONTENT.title,
        data: {
          breadcrumb: `${PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE}`,
          preventReuseRoute: true,
        },
        resolve: {
          backlink: (route: ActivatedRouteSnapshot) => {
            const measureIndex = +route.paramMap.get('measureIndex');
            return measureIndex
              ? `../../${measureIndex - 1}/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.UPDATE_FOR_MEASURE}`
              : `../../../../`;
          },
        },
        canActivate: [canActivateUpdateForMeasure],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/update-for-measure').then(
            (c) => c.UpdateForMeasureComponent,
          ),
      },
      {
        path: `:measureIndex/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.EDIT_UPDATE_FOR_MEASURE}`,
        title: UPDATE_FOR_MEASURE_FORM_CONTENT.editTitle,
        data: { breadcrumb: 'Edit measure', backlink: '../../' },
        canActivate: [canActivateEditUpdateForMeasure],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/update-for-measure').then(
            (c) => c.UpdateForMeasureComponent,
          ),
      },
      {
        path: ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.ADD_NEW_MEASURE,
        title: NEW_MEASURE_FORM_CONTENT.title,
        data: { breadcrumb: 'Add measure', backlink: '../' },
        canActivate: [canActivateAddNewMeasure],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/new-measure').then(
            (c) => c.NewMeasureComponent,
          ),
      },
      {
        path: `:measureIndex/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.EDIT_NEW_MEASURE}`,
        title: NEW_MEASURE_FORM_CONTENT.editTitle,
        data: { breadcrumb: 'Edit measure', backlink: '../../' },
        canActivate: [canActivateEditOrRemoveNewMeasure],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/new-measure').then(
            (c) => c.NewMeasureComponent,
          ),
      },
      {
        path: `:measureIndex/${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.REMOVE_NEW_MEASURE}`,
        title: 'Remove measure',
        data: { breadcrumb: 'Remove measure', backlink: '../../' },
        canActivate: [canActivateEditOrRemoveNewMeasure],
        loadComponent: () =>
          import('@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/remove-measure').then(
            (c) => c.RemoveMeasureComponent,
          ),
      },
    ],
  },
];

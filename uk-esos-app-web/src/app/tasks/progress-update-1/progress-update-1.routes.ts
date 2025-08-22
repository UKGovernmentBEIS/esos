import { Routes } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { canActivateGroupChange, PU_GROUP_CHANGE_SUBTASK_PATH } from '@tasks/progress-update-common/pu-group-change';
import { PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH } from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import {
  provideProgressUpdate1SideEffects,
  provideProgressUpdate1StepFlowManagers,
  provideProgressUpdate1TaskServices,
} from './progress-update-1.providers';
import { PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH } from './subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';

export const PU1_ROUTES: Routes = [
  {
    path: '',
    providers: [
      SideEffectsHandler,
      provideProgressUpdate1TaskServices(),
      provideProgressUpdate1SideEffects(),
      provideProgressUpdate1StepFlowManagers(),
    ],
    children: [
      {
        path: PU_GROUP_CHANGE_SUBTASK_PATH,
        canActivate: [canActivateGroupChange],
        loadChildren: () =>
          import('@tasks/progress-update-common/pu-group-change').then((r) => r.PU_GROUP_CHANGE_ROUTES),
      },
      {
        path: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        loadChildren: () =>
          import('./subtasks/pu1-energy-efficiency-measures').then((r) => r.PU1_ENERGY_EFFICIENCY_MEASURES_ROUTES),
      },
      {
        path: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        loadChildren: () =>
          import('@tasks/progress-update-common//pu-responsible-officer-confirmation').then(
            (r) => r.PU_RESPONSIBLE_OFFICER_CONFIRMATION_ROUTES,
          ),
      },
      {
        path: 'submit',
        loadChildren: () => import('./submit').then((r) => r.PU1_SUBMIT_ROUTES),
      },
    ],
  },
];

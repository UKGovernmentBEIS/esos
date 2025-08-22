import { Routes } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { canActivateGroupChange, PU_GROUP_CHANGE_SUBTASK_PATH } from '@tasks/progress-update-common/pu-group-change';
import { PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH } from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import {
  provideProgressUpdate2SideEffects,
  provideProgressUpdate2StepFlowManagers,
  provideProgressUpdate2TaskServices,
} from './progress-update-2.providers';
import { PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH } from './subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';

export const PU2_ROUTES: Routes = [
  {
    path: '',
    providers: [
      SideEffectsHandler,
      provideProgressUpdate2TaskServices(),
      provideProgressUpdate2SideEffects(),
      provideProgressUpdate2StepFlowManagers(),
    ],
    children: [
      {
        path: PU_GROUP_CHANGE_SUBTASK_PATH,
        canActivate: [canActivateGroupChange],
        loadChildren: () =>
          import('@tasks/progress-update-common/pu-group-change').then((r) => r.PU_GROUP_CHANGE_ROUTES),
      },
      {
        path: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        loadChildren: () =>
          import('./subtasks/pu2-energy-efficiency-measures').then((r) => r.PU2_ENERGY_EFFICIENCY_MEASURES_ROUTES),
      },
      {
        path: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        loadChildren: () =>
          import('@tasks/progress-update-common/pu-responsible-officer-confirmation').then(
            (r) => r.PU_RESPONSIBLE_OFFICER_CONFIRMATION_ROUTES,
          ),
      },
      {
        path: 'submit',
        loadChildren: () => import('./submit').then((r) => r.PU2_SUBMIT_ROUTES),
      },
    ],
  },
];

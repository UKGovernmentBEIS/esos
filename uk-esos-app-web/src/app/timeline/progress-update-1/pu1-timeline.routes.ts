import { Routes } from '@angular/router';

import {
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';
import {
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

export const PU1_TIMELINE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: PU_GROUP_CHANGE_SUBTASK_PATH,
        title: PU_GROUP_CHANGE_SUBTASK_TITLE,
        data: { breadcrumb: PU_GROUP_CHANGE_SUBTASK_TITLE },
        loadComponent: () => import('./subtasks/pu1-group-change/pu1-group-change.component'),
      },
      {
        path: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        title: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
        data: { breadcrumb: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE },
        loadComponent: () =>
          import('./subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.component'),
      },
      {
        path: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        title: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
        data: { breadcrumb: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE },
        loadComponent: () =>
          import('./subtasks/pu1-responsible-officer-confirmation/pu1-responsible-officer-confirmation.component'),
      },
    ],
  },
];

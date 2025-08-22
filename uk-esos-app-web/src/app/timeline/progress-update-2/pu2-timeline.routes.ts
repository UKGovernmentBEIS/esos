import { Routes } from '@angular/router';

import {
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';
import {
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

export const PU2_TIMELINE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: PU_GROUP_CHANGE_SUBTASK_PATH,
        title: PU_GROUP_CHANGE_SUBTASK_TITLE,
        data: { breadcrumb: PU_GROUP_CHANGE_SUBTASK_TITLE },
        loadComponent: () => import('./subtasks/pu2-group-change/pu2-group-change.component'),
      },
      {
        path: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        title: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
        data: { breadcrumb: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE },
        loadComponent: () =>
          import('./subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.component'),
      },
      {
        path: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        title: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
        data: { breadcrumb: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE },
        loadComponent: () =>
          import('./subtasks/pu2-responsible-officer-confirmation/pu2-responsible-officer-confirmation.component'),
      },
    ],
  },
];

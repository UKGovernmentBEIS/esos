import { Routes } from '@angular/router';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '@tasks/action-plan/subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/action-plan/subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';

export const ACTION_PLAN_TIMELINE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        title: ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
        data: { breadcrumb: ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE },
        loadComponent: () => import('./subtasks/energy-efficiency-measures/energy-efficiency-measures.component'),
      },
      {
        path: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        title: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
        data: { breadcrumb: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE },
        loadComponent: () =>
          import('./subtasks/responsible-officer-confirmation/responsible-officer-confirmation.component'),
      },
    ],
  },
];

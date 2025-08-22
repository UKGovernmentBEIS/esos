import { Routes } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';

import {
  provideActionPlanSideEffects,
  provideActionPlanStepFlowManagers,
  provideActionPlanTaskServices,
} from './action-plan.providers';
import { ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH } from './subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import { RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH } from './subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';

export const ACTION_PLAN_ROUTES: Routes = [
  {
    path: '',
    providers: [
      SideEffectsHandler,
      provideActionPlanTaskServices(),
      provideActionPlanSideEffects(),
      provideActionPlanStepFlowManagers(),
    ],
    children: [
      {
        path: ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
        loadChildren: () =>
          import('./subtasks/energy-efficiency-measures').then((r) => r.ENERGY_EFFICIENCY_MEASURES_ROUTES),
      },
      {
        path: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
        loadChildren: () =>
          import('./subtasks/responsible-officer-confirmation').then((r) => r.RESPONSIBLE_OFFICER_CONFIRMATION_ROUTES),
      },
      {
        path: 'submit',
        loadChildren: () => import('./submit').then((r) => r.ACTION_PLAN_SUBMIT_ROUTES),
      },
    ],
  },
];

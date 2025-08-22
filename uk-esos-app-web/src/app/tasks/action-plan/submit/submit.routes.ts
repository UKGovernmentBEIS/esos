import { Routes } from '@angular/router';

export const ACTION_PLAN_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: { breadcrumb: 'Submit to regulator', backlink: '../../' },
        loadComponent: () => import('./action/action.component').then((c) => c.ActionPlanSubmitActionComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then((c) => c.ActionPlanSubmitConfirmationComponent),
      },
      {
        path: 'action-plan-errors',
        data: { breadcrumb: 'Submit to regulator' },
        loadComponent: () =>
          import('../action-plan-errors/action-plan-errors.component').then((c) => c.ActionPlanErrorComponent),
      },
    ],
  },
];

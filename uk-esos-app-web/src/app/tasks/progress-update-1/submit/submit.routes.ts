import { Routes } from '@angular/router';

export const PU1_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: { breadcrumb: 'Submit to regulator', backlink: '../../' },
        loadComponent: () => import('./action/action.component').then((c) => c.ProgressUpdate1SubmitActionComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then((c) => c.ProgressUpdate1SubmitConfirmationComponent),
      },
      {
        path: 'pu1-errors',
        data: { breadcrumb: 'Submit to regulator' },
        loadComponent: () =>
          import('../progress-update-1-errors/progress-update-1-errors.component').then(
            (c) => c.ProgressUpdate1ErrorComponent,
          ),
      },
    ],
  },
];

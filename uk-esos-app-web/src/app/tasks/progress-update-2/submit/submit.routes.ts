import { Routes } from '@angular/router';

export const PU2_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        data: { breadcrumb: 'Submit to regulator', backlink: '../../' },
        loadComponent: () => import('./action/action.component').then((c) => c.ProgressUpdate2SubmitActionComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then((c) => c.ProgressUpdate2SubmitConfirmationComponent),
      },
      {
        path: 'pu2-errors',
        data: { breadcrumb: 'Submit to regulator' },
        loadComponent: () =>
          import('../progress-update-2-errors/progress-update-2-errors.component').then(
            (c) => c.ProgressUpdate2ErrorComponent,
          ),
      },
    ],
  },
];

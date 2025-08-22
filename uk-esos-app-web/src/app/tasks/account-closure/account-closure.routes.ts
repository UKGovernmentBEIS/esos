import { Routes } from '@angular/router';

export const ACCOUNT_CLOSURE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'submit',
        data: { backlink: '../../' },
        loadComponent: () =>
          import('./components/account-closure-submit/account-closure-submit.component').then(
            (c) => c.AccountClosureSubmitComponent,
          ),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./components/account-closure-confirmation/account-closure-confirmation.component').then(
            (c) => c.AccountClosureConfirmationComponent,
          ),
      },
    ],
  },
];

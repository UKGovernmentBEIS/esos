import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';

export const NOTIFICATION_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Submit to regulator' },
        loadComponent: () => import('./action/action.component').then((c) => c.NotificationSubmitActionComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then((c) => c.NotificationSubmitConfirmationComponent),
      },
      {
        path: 'notification-errors',
        data: { breadcrumb: 'Submit to regulator' },
        loadComponent: () =>
          import('../notification-errors/notification-errors.component').then((c) => c.NotificationErrorComponent),
      },
    ],
  },
];

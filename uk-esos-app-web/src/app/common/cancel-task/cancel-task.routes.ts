import { Routes } from '@angular/router';

import { CancelComponent } from '@common/cancel-task/components/cancel';
import { ConfirmationComponent } from '@common/cancel-task/components/confirmation';

export const ROUTES: Routes = [
  {
    path: '',
    component: CancelComponent,
    title: 'Task cancellation',
    data: { backlink: '../' },
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    title: 'Task cancelled',
  },
];

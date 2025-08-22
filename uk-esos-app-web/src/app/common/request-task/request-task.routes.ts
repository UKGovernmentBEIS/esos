import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { RequestTaskPageComponent } from '@common/request-task/components/request-task-page';
import { ItemNamePipe } from '@shared/pipes/item-name.pipe';

import { RequestTaskDTO } from 'esos-api';

export const REQUEST_TASK_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: () => new ItemNamePipe().transform(inject(RequestTaskStore).state.requestTaskItem.requestTask.type),
        data: { backlink: '/dashboard' },
        resolve: {
          backlink: () =>
            requestTaskBacklinkResolver(
              inject(RequestTaskStore).state.requestTaskItem.requestTask.type,
              inject(Router),
            ),
        },
        component: RequestTaskPageComponent,
      },
      {
        path: 'change-assignee',
        loadChildren: () => import('../change-task-assignee').then((r) => r.ROUTES),
      },
      {
        path: 'cancel',
        loadChildren: () => import('../cancel-task').then((r) => r.ROUTES),
      },
    ],
  },
];

function requestTaskBacklinkResolver(requestTaskType: RequestTaskDTO['type'], router: Router) {
  return () => {
    if (requestTaskType === 'ACCOUNT_CLOSURE_SUBMIT') {
      return router.routerState.snapshot.url.includes('accounts') ? '../../' : '/dashboard';
    }
    return null;
  };
}

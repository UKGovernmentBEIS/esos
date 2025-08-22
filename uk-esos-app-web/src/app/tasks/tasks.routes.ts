import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { canActivateRequestTaskPage, canDeactivateRequestTaskPage } from '@common/request-task/request-task.guards';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, TYPE_AWARE_STORE } from '@common/store';
import { TaskTypeToBreadcrumbPipe } from '@shared/pipes/task-type-to-breadcrumb.pipe';

import { RequestTaskDTO } from 'esos-api';

import { ACCOUNT_CLOSURE_TASK_PATH } from './account-closure/account-closure-step-flow-manager';
import { PU1_ROUTE_PATH } from './progress-update-1/progress-update-1-task-content';
import { PU2_ROUTE_PATH } from './progress-update-2/progress-update-2-task-content';
import { tasksContent } from './tasks-content';

const taskTypeToReturnText = (type: RequestTaskDTO['type']): string => {
  return new TaskTypeToBreadcrumbPipe().transform(type as any) ?? 'Dashboard';
};

export const TASKS_ROUTES: Routes = [
  {
    path: ':taskId',
    data: { breadcrumb: ({ type }) => new TaskTypeToBreadcrumbPipe().transform(type) },
    resolve: { type: () => inject(RequestTaskStore).state.requestTaskItem.requestTask.type },
    canActivate: [canActivateRequestTaskPage],
    canDeactivate: [canDeactivateRequestTaskPage],
    providers: [
      { provide: TYPE_AWARE_STORE, useExisting: RequestTaskStore },
      { provide: ITEM_TYPE_TO_RETURN_TEXT_MAPPER, useValue: taskTypeToReturnText },
    ],
    children: [
      {
        path: '',
        providers: [
          {
            provide: REQUEST_TASK_PAGE_CONTENT,
            useValue: tasksContent,
          },
        ],
        loadChildren: () => import('@common/request-task').then((r) => r.REQUEST_TASK_ROUTES),
      },
      {
        path: 'timeline',
        loadChildren: () => import('@timeline/timeline.routes').then((r) => r.TIMELINE_ROUTES),
      },
      {
        path: 'organisation-account-application-review',
        loadChildren: () =>
          import('./organisation-account-application-review/organisation-account-application-review.routes').then(
            (r) => r.ROUTES,
          ),
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.routes').then((r) => r.NOTIFICATION_ROUTES),
      },
      {
        path: 'action-plan',
        loadChildren: () => import('./action-plan/action-plan.routes').then((r) => r.ACTION_PLAN_ROUTES),
      },
      {
        path: ACCOUNT_CLOSURE_TASK_PATH,
        loadChildren: () => import('./account-closure/account-closure.routes').then((r) => r.ACCOUNT_CLOSURE_ROUTES),
      },
      {
        path: PU1_ROUTE_PATH,
        loadChildren: () => import('./progress-update-1/progress-update-1.routes').then((r) => r.PU1_ROUTES),
      },
      {
        path: PU2_ROUTE_PATH,
        loadChildren: () => import('./progress-update-2/progress-update-2.routes').then((r) => r.PU2_ROUTES),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
];

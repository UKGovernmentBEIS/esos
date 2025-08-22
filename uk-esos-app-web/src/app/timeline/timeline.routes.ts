import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import {
  canActivateRequestActionPage,
  canDeactivateRequestActionPage,
} from '@common/request-action/request-action.guards';
import { REQUEST_ACTION_PAGE_CONTENT } from '@common/request-action/request-action.providers';
import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, TYPE_AWARE_STORE } from '@common/store';
import { ActionTypeToBreadcrumbPipe } from '@shared/pipes/action-type-to-breadcrumb.pipe';

import { RequestActionDTO } from 'esos-api';

import { PU1_ROUTE_PREFIX } from './progress-update-1/pu1-application-content';
import { PU2_ROUTE_PREFIX } from './progress-update-2/pu2-application-content';
import { timelineContent } from './timeline.content';

const actionTypeToReturnText = (type: RequestActionDTO['type']): string => {
  return new ActionTypeToBreadcrumbPipe().transform(type as any) ?? 'Dashboard';
};

export const TIMELINE_ROUTES: Routes = [
  {
    path: ':actionId',
    data: { breadcrumb: ({ type, submitter }) => new ActionTypeToBreadcrumbPipe().transform(type, submitter) },
    title: () =>
      new ActionTypeToBreadcrumbPipe().transform(
        inject(RequestActionStore).select(requestActionQuery.selectActionType)(),
        inject(RequestActionStore).select(requestActionQuery.selectSubmitter)(),
      ),
    resolve: {
      type: () => inject(RequestActionStore).select(requestActionQuery.selectActionType)(),
      submitter: () => inject(RequestActionStore).select(requestActionQuery.selectSubmitter)(),
    },
    providers: [
      { provide: REQUEST_ACTION_PAGE_CONTENT, useValue: timelineContent },
      { provide: TYPE_AWARE_STORE, useExisting: RequestActionStore },
      { provide: ITEM_TYPE_TO_RETURN_TEXT_MAPPER, useValue: actionTypeToReturnText },
    ],
    canActivate: [canActivateRequestActionPage],
    canDeactivate: [canDeactivateRequestActionPage],
    children: [
      {
        path: '',
        loadChildren: () => import('@common/request-action/request-action.routes').then((r) => r.ROUTES),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./notification/notification-timeline.routes').then((r) => r.NOTIFICATION_TIMELINE_ROUTES),
      },
      {
        path: 'action-plan',
        loadChildren: () =>
          import('./action-plan/action-plan-timeline.routes').then((r) => r.ACTION_PLAN_TIMELINE_ROUTES),
      },
      {
        path: PU1_ROUTE_PREFIX,
        loadChildren: () => import('./progress-update-1/pu1-timeline.routes').then((r) => r.PU1_TIMELINE_ROUTES),
      },
      {
        path: PU2_ROUTE_PREFIX,
        loadChildren: () => import('./progress-update-2/pu2-timeline.routes').then((r) => r.PU2_TIMELINE_ROUTES),
      },
    ],
  },
];

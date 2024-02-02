import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { logGoogleEvent } from '@core/analytics';
import { AuthStore, EsosAccount } from '@core/store';
import { HttpMethods } from 'keycloak-angular/lib/core/interfaces/keycloak-options';

type AllowedRoute = { method: HttpMethods; endpoint: string };

const taskActionRoute = {
  method: 'POST',
  endpoint: '/tasks/actions',
};
const userRegisterRoutes: AllowedRoute[] = [
  {
    method: 'POST',
    endpoint: '/operator-users/registration/register',
  },
  {
    method: 'PUT',
    endpoint: '/regulator-users/registration/enable-from-invitation',
  },
];

const accountCreateRoutes: AllowedRoute[] = [
  {
    endpoint: 'aviation/accounts',
    method: 'POST',
  },
  {
    endpoint: 'requests',
    method: 'POST',
  },
];

const allowedRoutes = [taskActionRoute, ...userRegisterRoutes, ...accountCreateRoutes];

@Injectable()
export class AnalyticsInterceptor implements HttpInterceptor {
  constructor(private authStore: AuthStore) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const allowedRoute = allowedRoutes.find((ar) => request.url.includes(ar.endpoint));
    if (!allowedRoute) return next.handle(request);
    if (request.url.includes(taskActionRoute.endpoint) && request.method === taskActionRoute.method) {
      this.handleTaskAction(request);
    } else if (userRegisterRoutes.some((r) => r.method === request.method && request.url.includes(r.endpoint))) {
      logGoogleEvent('USER_REGISTERED');
    } else if (accountCreateRoutes.some((r) => r.method === request.method && request.url.includes(r.endpoint))) {
      this.handleAccountCreate(request);
    }
    return next.handle(request);
  }

  handleTaskAction(request: HttpRequest<unknown>): void {
    let requestId: string;

    if (!requestId) {
      console.warn('no request id. will not log ga event');
      return;
    }

    const body = request.body;
    const eventName = body['requestTaskActionType'];
    const requestTaskId = body['requestTaskId'];
    const scheme = EsosAccount;
    const role = this.authStore.getState().userState.roleType;

    logGoogleEvent(eventName, {
      requestTaskId,
      scheme,
      role,
      requestId,
    });
  }
  handleAccountCreate(request: HttpRequest<unknown>): void {
    if (request.body['requestCreateActionType'] === 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION')
      logGoogleEvent('ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION', {
        scheme: EsosAccount,
      });
  }
}

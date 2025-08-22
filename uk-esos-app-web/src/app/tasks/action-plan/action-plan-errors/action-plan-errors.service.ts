import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { from, ignoreElements, Observable } from 'rxjs';

import { ActionPlanError } from './action-plan-errors';
import { ActionPlanErrorData } from './action-plan-errors.interfaces';

@Injectable({ providedIn: 'root' })
export class ActionPlanErrorService {
  readonly error = signal(null as ActionPlanError);

  constructor(private readonly router: Router) {}

  showError(error: ActionPlanError, data: ActionPlanErrorData): Observable<boolean> {
    const url = this.router.url.includes('action-plan-errors')
      ? [this.router.url]
      : [this.router.url, 'action-plan-errors'];

    this.error.set(error);

    return from(this.router.navigate(url, { skipLocationChange: true, state: { data } })).pipe(ignoreElements());
  }

  clear(): void {
    this.error.set(null);
  }
}

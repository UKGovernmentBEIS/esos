import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { from, ignoreElements, Observable } from 'rxjs';

import { NotificationError } from './notification-errors';
import { NotificationErrorData } from './notification-errors.interfaces';

@Injectable({ providedIn: 'root' })
export class NotificationErrorService {
  readonly error = signal(null as NotificationError);

  constructor(private readonly router: Router) {}

  showError(error: NotificationError, data: NotificationErrorData): Observable<boolean> {
    const url = this.router.url.includes('notification-errors')
      ? [this.router.url]
      : [this.router.url, 'notification-errors'];

    this.error.set(error);

    return from(this.router.navigate(url, { skipLocationChange: true, state: { data } })).pipe(ignoreElements());
  }

  clear(): void {
    this.error.set(null);
  }
}

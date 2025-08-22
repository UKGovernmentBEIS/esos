import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { from, ignoreElements, Observable } from 'rxjs';

import { ProgressUpdate1Error } from './progress-update-1-errors';
import { ProgressUpdate1ErrorData } from './progress-update-1-errors.interfaces';

@Injectable({ providedIn: 'root' })
export class ProgressUpdate1ErrorService {
  readonly error = signal(null as ProgressUpdate1Error);

  constructor(private readonly router: Router) {}

  showError(error: ProgressUpdate1Error, data: ProgressUpdate1ErrorData): Observable<boolean> {
    const url = this.router.url.includes('pu1-errors') ? [this.router.url] : [this.router.url, 'pu1-errors'];
    this.error.set(error);
    return from(this.router.navigate(url, { skipLocationChange: true, state: { data } })).pipe(ignoreElements());
  }

  clear(): void {
    this.error.set(null);
  }
}

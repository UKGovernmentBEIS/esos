import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { from, ignoreElements, Observable } from 'rxjs';

import { ProgressUpdate2Error } from './progress-update-2-errors';
import { ProgressUpdate2ErrorData } from './progress-update-2-errors.interfaces';

@Injectable({ providedIn: 'root' })
export class ProgressUpdate2ErrorService {
  readonly error = signal(null as ProgressUpdate2Error);

  constructor(private readonly router: Router) {}

  showError(error: ProgressUpdate2Error, data: ProgressUpdate2ErrorData): Observable<boolean> {
    const url = this.router.url.includes('pu2-errors') ? [this.router.url] : [this.router.url, 'pu2-errors'];
    this.error.set(error);
    return from(this.router.navigate(url, { skipLocationChange: true, state: { data } })).pipe(ignoreElements());
  }

  clear(): void {
    this.error.set(null);
  }
}

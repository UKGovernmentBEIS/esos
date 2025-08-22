import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY, from, Observable, switchMap, throwError } from 'rxjs';

import { HttpStatuses } from '@error/http-status';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandlingService implements ErrorHandler {
  excludedUrls = ['.+/account/+\\w+/header-info$'];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {}

  handleError(error: unknown): void {
    this.ngZone.run(() =>
      error instanceof HttpErrorResponse && error.status === HttpStatuses.NotFound
        ? this.router.navigate(['/error', '404'], { state: { forceNavigation: true } })
        : this.router.navigate(['/error', '500'], { state: { forceNavigation: true }, skipLocationChange: true }),
    );
    console.error('ERROR', error);
  }

  handleHttpError(res: HttpErrorResponse): Observable<never> {
    const urlContained = this.excludedUrls.some((url) => new RegExp(url).test(res.url));
    if (!urlContained) {
      switch (res.status) {
        case HttpStatuses.InternalServerError:
          return from(
            this.router.navigate(['/error', '500'], { state: { forceNavigation: true }, skipLocationChange: true }),
          ).pipe(switchMap(() => EMPTY));
        case HttpStatuses.Unauthorized:
          return from(this.authService.login()).pipe(switchMap(() => EMPTY));
        case HttpStatuses.Forbidden:
          return from(this.router.navigate(['landing'], { state: { forceNavigation: true } })).pipe(
            switchMap(() => EMPTY),
          );
        default:
          return throwError(() => res);
      }
    } else {
      return throwError(() => res);
    }
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom } from 'rxjs';

import { AuthStore } from '@core/store/auth';
import { HttpStatuses } from '@error/http-status';
import { mockClass } from '@testing';

import { AuthService } from '../services/auth.service';
import { GlobalErrorHandlingService } from './global-error-handling.service';

describe(`GlobalErrorHandlingService`, () => {
  let service: GlobalErrorHandlingService;
  let router: Router;
  let authStore: AuthStore;
  const authService = mockClass(AuthService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ErrorHandler, useClass: GlobalErrorHandlingService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ status: 'ENABLED' });
    service = TestBed.inject(GlobalErrorHandlingService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should handle uncaught application errors', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);

    service.handleError(Error('Uncaught'));

    expect(navigateSpy).toHaveBeenCalledWith(['/error', '500'], {
      state: { forceNavigation: true },
      skipLocationChange: true,
    });
  });

  it('should handle uncaught http 404 error', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);

    service.handleError(new HttpErrorResponse({ status: 404, statusText: 'test' }));

    expect(navigateSpy).toHaveBeenCalledWith(['/error', '404'], {
      state: { forceNavigation: true },
    });
  });

  it('should handle the 500 error', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);

    await expect(
      firstValueFrom(service.handleHttpError(new HttpErrorResponse({ status: 500, statusText: 'test' }))),
    ).rejects.toBeTruthy();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/error', '500'], {
      state: { forceNavigation: true },
      skipLocationChange: true,
    });
  });

  it('should handle the 401 error', async () => {
    authService.login.mockResolvedValueOnce();

    await expect(
      firstValueFrom(
        service.handleHttpError(
          new HttpErrorResponse({
            status: HttpStatuses.Unauthorized,
            statusText: 'test',
          }),
        ),
      ),
    ).rejects.toBeTruthy();

    expect(authService.login).toHaveBeenCalledTimes(1);
  });

  it('should handle the 403 error', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);

    await expect(
      firstValueFrom(
        service.handleHttpError(
          new HttpErrorResponse({
            status: HttpStatuses.Forbidden,
            statusText: 'test',
          }),
        ),
      ),
    ).rejects.toBeTruthy();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['landing'], { state: { forceNavigation: true } });
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('should forward not handled errors', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
    const error = new HttpErrorResponse({ status: 400, statusText: 'test' });

    expect(firstValueFrom(service.handleHttpError(error))).rejects.toEqual(error);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should forward error if it is a skip url', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
    const error = new HttpErrorResponse({ status: 403, statusText: 'test', url: 'localhost/account/200/header-info' });

    expect(firstValueFrom(service.handleHttpError(error))).rejects.toEqual(error);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});

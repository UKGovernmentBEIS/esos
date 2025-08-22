import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { AuthStore } from '@core/store/auth';
import { MockType } from '@testing';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let authStore: AuthStore;

  const authService: MockType<AuthService> = {
    checkUser: jest.fn(() => of(undefined)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    authStore = TestBed.inject(AuthStore);
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it("should redirect to terms if user is logged in and terms don't match", async () => {
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ status: 'DISABLED' });
    authStore.setTerms({ version: 2, url: 'asd' });

    let res = await lastValueFrom(guard.canActivate());

    expect(res).toEqual(router.parseUrl('landing'));

    authStore.setUserState({ status: 'ENABLED' });
    res = await lastValueFrom(guard.canActivate());
    expect(res).toEqual(true);
  });

  it('should redirect to landing page if user is not logged in or is disabled', async () => {
    authStore.setIsLoggedIn(false);
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));

    authStore.setIsLoggedIn(true);
    authStore.setTerms({ version: 1 } as any);
    authStore.setUser({ termsVersion: 1 } as any);
    authStore.setUserState({ status: 'DISABLED' });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));

    authStore.setIsLoggedIn(true);
    authStore.setUserState({ status: 'TEMP_DISABLED' });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));
  });
});

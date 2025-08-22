import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { MockType } from '@testing';

import { LandingPageGuard } from './landing-page.guard';

describe('LandingPageGuard', () => {
  let guard: LandingPageGuard;
  let router: Router;
  let authStore: AuthStore;

  const authService: MockType<AuthService> = {
    checkUser: jest.fn(() => of(undefined)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }, LandingPageGuard],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ status: 'ENABLED' });
    authStore.setUser({ email: 'asd@asd.com', firstName: 'Darth', lastName: 'Vader', termsVersion: 1 });
    authStore.setUserProfile({ attributes: { status: ['REGISTERED'] } });
    guard = TestBed.inject(LandingPageGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow if user is not logged in', () => {
    authStore.setIsLoggedIn(false);
    return expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });

  it('should allow if user is logged in and status is not ENABLED', () => {
    authStore.setUserState({ status: 'DISABLED' });
    return expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });

  it('should allow if user is logged in and no authority', () => {
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ status: 'NO_AUTHORITY' });
    return expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });

  it(`should allow when user has login with status 'ACCEPTED'`, async () => {
    authStore.setUserState({ status: 'ACCEPTED' });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });

  it(`should redirect to dashboard when user is REGULATOR or VERIFIER and has NO_AUTHORITY`, async () => {
    authStore.setUserState({
      roleType: 'REGULATOR',
      status: 'NO_AUTHORITY',
    });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('dashboard'));

    authStore.setUserState({ ...authStore.getState().userState, roleType: 'VERIFIER' });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('dashboard'));

    authStore.setUserState({
      ...authStore.getState().userState,
      roleType: 'OPERATOR',
    });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });

  it(`should redirect to register if authentication status is not REGISTERED`, async () => {
    authStore.setUserState({
      roleType: 'OPERATOR',
    });
    authStore.setUserProfile({ attributes: { status: ['PENDING'] } });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('registration/register'));

    authStore.setUserProfile({ attributes: {} });
    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('registration/register'));
  });
});

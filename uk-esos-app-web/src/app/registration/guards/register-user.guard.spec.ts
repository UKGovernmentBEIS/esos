import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { MockType } from '@testing';

import { RegisterUserGuard } from './register-user.guard';

describe('RegisterUserGuard', () => {
  let guard: RegisterUserGuard;
  let router: Router;
  let authStore: AuthStore;

  const authService: MockType<AuthService> = {
    checkUser: jest.fn(() => of(undefined)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }, RegisterUserGuard],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserState({ roleType: 'OPERATOR' });
    guard = TestBed.inject(RegisterUserGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to landing if not logged in', async () => {
    authStore.setIsLoggedIn(false);

    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));
  });

  it('should redirect to dashboard if status is REGISTERED', async () => {
    authStore.setUserProfile({ attributes: { status: ['REGISTERED'] } });

    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('dashboard'));
  });

  it('should redirect to landing if REGULATOR', async () => {
    authStore.setUserState({ roleType: 'REGULATOR' });

    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));
  });

  it('should return true if user is OPERATOR and not REGISTERED', async () => {
    authStore.setUserState({ roleType: 'OPERATOR' });
    authStore.setUserProfile({ attributes: {} });

    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(true);
  });
});

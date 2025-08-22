import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom } from 'rxjs';

import { AuthStore } from '@core/store';

import { RegisteredUserGuard } from './registered-user.guard';

describe('RegisteredUserGuard', () => {
  let guard: RegisteredUserGuard;
  let router: Router;
  let authStore: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RegisteredUserGuard],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    authStore.setUserProfile({ attributes: { status: ['REGISTERED'] } });
    guard = TestBed.inject(RegisteredUserGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to dashboard if status is REGISTERED', async () => {
    authStore.setUserProfile({ attributes: { status: ['PENDING'] } });

    await expect(lastValueFrom(guard.canActivate())).resolves.toEqual(router.parseUrl('landing'));
  });
});

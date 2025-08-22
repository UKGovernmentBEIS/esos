import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of, throwError } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store';
import { ActivatedRouteSnapshotStub, MockType } from '@testing';

import { OperatorUsersRegistrationService, UserTokenService } from 'esos-api';

import { InviteOperatorGuard } from './invite-operator.guard';

describe('InviteOperatorGuard', () => {
  let guard: InviteOperatorGuard;
  let operatorUsersRegistrationService: Partial<jest.Mocked<OperatorUsersRegistrationService>>;
  let userTokenService: UserTokenService;
  let authStore: AuthStore;
  let router: Router;

  beforeEach(() => {
    operatorUsersRegistrationService = {
      acceptOperatorInvitation: jest.fn(),
    };

    const authService: MockType<AuthService> = {
      checkUser: jest.fn(() => of(undefined)),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: OperatorUsersRegistrationService, useValue: operatorUsersRegistrationService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    guard = TestBed.inject(InviteOperatorGuard);
    router = TestBed.inject(Router);
    userTokenService = TestBed.inject(UserTokenService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to invalid-link if there is no token query param', async () => {
    jest.spyOn(userTokenService, 'resolveEmailByToken').mockReturnValue(of({ email: 'email@email' }));
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?param1=foo',
        } as RouterStateSnapshot),
      ),
    ).resolves.toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['/registration/invitation/invalid-link']);
    expect(operatorUsersRegistrationService.acceptOperatorInvitation).not.toHaveBeenCalled();
    expect(userTokenService.resolveEmailByToken).not.toHaveBeenCalled();
  });

  it('should redirect to start-login page if user is not logged', async () => {
    authStore.setIsLoggedIn(false);
    jest.spyOn(userTokenService, 'resolveEmailByToken').mockReturnValue(of({ email: 'email@email' }));
    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?token=123',
        } as RouterStateSnapshot),
      ),
    ).resolves.toEqual(router.parseUrl('start-login?redirectUrl=http://localhost/?token=123&email=email@email'));
    expect(operatorUsersRegistrationService.acceptOperatorInvitation).not.toHaveBeenCalled();
    expect(userTokenService.resolveEmailByToken).toHaveBeenCalledWith({ token: '123', type: 'OPERATOR_INVITATION' });
  });

  it('should redirect to contact details page if user is logged with status not REGISTERED', async () => {
    authStore.setIsLoggedIn(true);
    authStore.setUserProfile({ attributes: { status: ['PENDING'] } });

    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?token=123',
        } as RouterStateSnapshot),
      ),
    ).resolves.toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['registration/register']);
  });

  it('should accept invite when user is registered and loggedin ', async () => {
    authStore.setIsLoggedIn(true);
    authStore.setUserProfile({ attributes: { status: ['REGISTERED'] } });
    operatorUsersRegistrationService.acceptOperatorInvitation.mockReturnValue(of(null));

    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?token=123',
        } as RouterStateSnapshot),
      ),
    ).resolves.toBeTruthy();
  });

  it('should navigate to invalid link when user is registered and loggedin and the invitation link has expired', async () => {
    authStore.setIsLoggedIn(true);
    authStore.setUserProfile({ attributes: { status: ['REGISTERED'] } });
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    operatorUsersRegistrationService.acceptOperatorInvitation.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { code: 'EMAIL1001' }, status: 400 })),
    );

    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?token=123',
        } as RouterStateSnapshot),
      ),
    ).resolves.toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/registration/invitation/invalid-link'], {
      queryParams: { code: 'EMAIL1001' },
    });
  });
});

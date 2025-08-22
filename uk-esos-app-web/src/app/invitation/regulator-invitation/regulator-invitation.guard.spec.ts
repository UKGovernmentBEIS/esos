import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store';
import { ActivatedRouteSnapshotStub, mockClass, MockType } from '@testing';

import { RegulatorUsersRegistrationService, UserTokenService } from 'esos-api';

import { RegulatorInvitationGuard } from './regulator-invitation.guard';

describe('RegulatorInvitationGuard', () => {
  let guard: RegulatorInvitationGuard;
  let router: Router;
  let authStore: AuthStore;
  let userTokenService: UserTokenService;

  let regulatorUsersRegistrationService: jest.Mocked<RegulatorUsersRegistrationService>;

  const authService: MockType<AuthService> = {
    checkUser: jest.fn(() => of(undefined)),
  };

  beforeEach(() => {
    regulatorUsersRegistrationService = mockClass(RegulatorUsersRegistrationService);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: RegulatorUsersRegistrationService, useValue: regulatorUsersRegistrationService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setIsLoggedIn(true);
    guard = TestBed.inject(RegulatorInvitationGuard);
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
    expect(navigateSpy).toHaveBeenCalledWith(['invitation/regulator/invalid-link']);
    expect(regulatorUsersRegistrationService.acceptRegulatorInvitationAndRegister).not.toHaveBeenCalled();
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
    expect(regulatorUsersRegistrationService.acceptRegulatorInvitationAndRegister).not.toHaveBeenCalled();
    expect(userTokenService.resolveEmailByToken).toHaveBeenCalledWith({ token: '123', type: 'REGULATOR_INVITATION' });
  });

  it('should return true if user is logged', async () => {
    authStore.setIsLoggedIn(true);

    regulatorUsersRegistrationService.acceptRegulatorInvitationAndRegister.mockReturnValue(of(null));

    await expect(
      lastValueFrom(
        guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: '123' }), {
          url: '/?token=123',
        } as RouterStateSnapshot),
      ),
    ).resolves.toBeTruthy();

    expect(regulatorUsersRegistrationService.acceptRegulatorInvitationAndRegister).toHaveBeenCalledWith({
      token: '123',
    });
  });
});

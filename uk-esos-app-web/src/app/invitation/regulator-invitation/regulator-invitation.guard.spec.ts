import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of, throwError } from 'rxjs';

import { ActivatedRouteSnapshotStub, mockClass } from '@testing';

import { InvitedUserInfoDTO, RegulatorUsersRegistrationService } from 'esos-api';

import { RegulatorInvitationGuard } from './regulator-invitation.guard';

describe('RegulatorInvitationGuard', () => {
  let guard: RegulatorInvitationGuard;
  let router: Router;
  let regulatorUsersRegistrationService: jest.Mocked<RegulatorUsersRegistrationService>;

  beforeEach(() => {
    regulatorUsersRegistrationService = mockClass(RegulatorUsersRegistrationService);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: RegulatorUsersRegistrationService, useValue: regulatorUsersRegistrationService }],
    });

    guard = TestBed.inject(RegulatorInvitationGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should navigate to root if there is no token query param', async () => {
    await expect(lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub()))).resolves.toEqual(
      router.parseUrl('landing'),
    );
    expect(regulatorUsersRegistrationService.acceptRegulatorInvitation).not.toHaveBeenCalled();
  });

  it('should navigate to invalid link for all 400 errors', async () => {
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    regulatorUsersRegistrationService.acceptRegulatorInvitation.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { code: 'testCode' }, status: 400 })),
    );

    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub(null, { token: 'email-token' }))),
    ).resolves.toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['invitation/regulator/invalid-link'], {
      queryParams: { code: 'testCode' },
    });
  });

  it('should resolved the invited user', async () => {
    const invitedUser: InvitedUserInfoDTO = { email: 'user@esos.uk' };
    regulatorUsersRegistrationService.acceptRegulatorInvitation.mockReturnValue(of(invitedUser));

    await lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub(undefined, { token: 'token' })));

    expect(guard.resolve()).toEqual(invitedUser);
    expect(regulatorUsersRegistrationService.acceptRegulatorInvitation).toHaveBeenCalledWith({
      token: 'token',
    });
  });
});

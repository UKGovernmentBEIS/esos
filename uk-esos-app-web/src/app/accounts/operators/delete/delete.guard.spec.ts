import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, throwError } from 'rxjs';

import { DetailsGuard } from '@accounts/index';
import { AuthStore } from '@core/store/auth';
import { BusinessTestingModule, expectBusinessErrorToBe } from '@error/testing/business-error';
import { ActivatedRouteSnapshotStub, address, asyncData } from '@testing';

import { OperatorUserDTO, OperatorUsersService, UsersService } from 'esos-api';

import { saveNotFoundOperatorError } from '../errors/business-error';
import { DeleteGuard } from './delete.guard';

describe('DeleteGuard', () => {
  let guard: DeleteGuard;
  let authStore: AuthStore;
  let usersService: Partial<jest.Mocked<UsersService>>;
  let operatorUsersService: Partial<jest.Mocked<OperatorUsersService>>;

  const operator: OperatorUserDTO = {
    address,
    email: 'test@host.com',
    firstName: 'Mary',
    lastName: 'Za',
    mobileNumber: { countryCode: '+30', number: '1234567890' },
    phoneNumber: { countryCode: '+30', number: '123456780' },
    jobTitle: '',
  };

  beforeEach(() => {
    operatorUsersService = {
      getOperatorUserById: jest.fn().mockReturnValue(asyncData<OperatorUserDTO>(operator)),
    };
    usersService = {
      getCurrentUser: jest.fn().mockReturnValue(asyncData<OperatorUserDTO>(operator)),
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BusinessTestingModule],
      providers: [
        DetailsGuard,
        { provide: UsersService, useValue: usersService },
        { provide: OperatorUsersService, useValue: operatorUsersService },
      ],
    });
    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      roleType: 'OPERATOR',
      userId: 'ABC1',
      status: 'ENABLED',
    });
    guard = TestBed.inject(DeleteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should provide other user information', async () => {
    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'asdf4' }))),
    ).resolves.toBeTruthy();

    await expect(guard.resolve()).toEqual(operator);

    expect(operatorUsersService.getOperatorUserById).toHaveBeenCalledWith(1, 'asdf4');
  });

  it('should provide current user information', async () => {
    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' }))),
    ).resolves.toBeTruthy();

    await expect(guard.resolve()).toEqual(operator);

    expect(usersService.getCurrentUser).toHaveBeenCalled();
  });

  it('should throw an error when visiting a deleted user', async () => {
    operatorUsersService.getOperatorUserById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'AUTHORITY1004' } })),
    );

    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'asdf4' }))),
    ).rejects.toBeTruthy();

    await expectBusinessErrorToBe(saveNotFoundOperatorError(1));
  });
});

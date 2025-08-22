import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom } from 'rxjs';

import { AuthStore } from '@core/store/auth';
import { ActivatedRouteSnapshotStub, asyncData } from '@testing';

import { RegulatorAuthoritiesService } from 'esos-api';

import { PermissionsResolver } from './permissions.resolver';

describe('PermissionsResolver', () => {
  let resolver: PermissionsResolver;
  let regulatorAuthService: Partial<jest.Mocked<RegulatorAuthoritiesService>>;
  let authStore: AuthStore;

  const permissions = {
    editable: true,
    permissions: {
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_USERS_AND_CONTACTS: 'EXECUTE',
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
    },
  };

  beforeEach(() => {
    regulatorAuthService = {
      getCurrentRegulatorUserPermissionsByCa: jest.fn().mockReturnValue(asyncData(permissions)),
      getRegulatorUserPermissionsByCaAndId: jest.fn().mockReturnValue(asyncData(permissions)),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: RegulatorAuthoritiesService, useValue: regulatorAuthService }],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      roleType: 'REGULATOR',
      status: 'ENABLED',
      userId: 'ABC1',
    });
    resolver = TestBed.inject(PermissionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should provide the permissions of another user', async () => {
    await expect(
      lastValueFrom(resolver.resolve(new ActivatedRouteSnapshotStub({ userId: '1234567' }))),
    ).resolves.toEqual(permissions);

    expect(regulatorAuthService.getRegulatorUserPermissionsByCaAndId).toHaveBeenCalledWith('1234567');
  });

  it('should provide current user permissions', async () => {
    await expect(
      lastValueFrom(resolver.resolve(new ActivatedRouteSnapshotStub({ accountId: '1', userId: 'ABC1' }))),
    ).resolves.toEqual(permissions);

    expect(regulatorAuthService.getCurrentRegulatorUserPermissionsByCa).toHaveBeenCalled();
  });
});

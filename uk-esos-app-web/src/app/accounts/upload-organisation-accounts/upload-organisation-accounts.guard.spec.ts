import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { regulatorUserRole } from '@accounts/testing/mock-data';
import { AuthStore } from '@core/store';
import { Permissions } from '@shared/interfaces';
import { ActivatedRouteSnapshotStub } from '@testing';

import { uploadOrganisationAccountsGuard } from './upload-organisation-accounts.guard';

const mockPermissions: Permissions = {
  MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
};
const mockRoute = new ActivatedRouteSnapshotStub({});
const mockRouterState = {} as RouterStateSnapshot;

describe('uploadOrganisationAccountsGuard', () => {
  let authStore: AuthStore;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [],
    });
    router = TestBed.inject(Router);
    authStore = TestBed.inject(AuthStore);
    authStore.setUserState(regulatorUserRole);
    authStore.setRegulatorPermissions(mockPermissions);
  });

  it('should be created', async () => {
    TestBed.runInInjectionContext(() => {
      expect(uploadOrganisationAccountsGuard(mockRoute, mockRouterState)).toBeTruthy();
    });
  });

  it('should return true when appropriate permissions are found', async () => {
    const guardResult = await TestBed.runInInjectionContext(() => {
      return firstValueFrom(uploadOrganisationAccountsGuard(mockRoute, mockRouterState) as Observable<boolean>);
    });

    expect(guardResult).toEqual(true);
  });

  it('should redirect to landing page when appropriate permissions are not found', async () => {
    authStore.setRegulatorPermissions(null);
    const guardResult = await TestBed.runInInjectionContext(() => {
      return firstValueFrom(uploadOrganisationAccountsGuard(mockRoute, mockRouterState) as Observable<boolean>);
    });

    expect(guardResult).toEqual(router.parseUrl('/landing'));
  });
});

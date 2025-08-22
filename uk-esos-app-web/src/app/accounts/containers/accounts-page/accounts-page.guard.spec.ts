import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';

import { firstValueFrom, Observable, of } from 'rxjs';

import { regulatorUserRole } from '@accounts/testing/mock-data';
import { AuthStore, selectRegulatorRelatedActions } from '@core/store';
import { ActivatedRouteSnapshotStub, mockClass, MockType } from '@testing';

import { AuthorityManagePermissionDTO, RegulatorAuthoritiesService } from 'esos-api';

import { accountsPageGuard } from './accounts-page.guard';

const mockPermissionDTO: AuthorityManagePermissionDTO = {
  permissions: {
    MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
  },
  editable: true,
};
const mockRoute = new ActivatedRouteSnapshotStub({});
const mockRouterState = {} as RouterStateSnapshot;

describe('accountsPageGuard', () => {
  let regulatorAuthoritiesService: MockType<RegulatorAuthoritiesService>;
  let authStore: AuthStore;

  beforeEach(async () => {
    regulatorAuthoritiesService = mockClass(RegulatorAuthoritiesService);
    regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa.mockReturnValueOnce(of(mockPermissionDTO));
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RegulatorAuthoritiesService,
          useValue: regulatorAuthoritiesService,
        },
      ],
    });
    authStore = TestBed.inject(AuthStore);
    authStore.setUserState(regulatorUserRole);
  });

  it('should be created', async () => {
    TestBed.runInInjectionContext(() => {
      expect(accountsPageGuard(mockRoute, mockRouterState)).toBeTruthy();
    });
  });

  it('should return true and set appropriate actions', async () => {
    const guardResult = await TestBed.runInInjectionContext(() => {
      return firstValueFrom(accountsPageGuard(mockRoute, mockRouterState) as Observable<boolean>);
    });
    const regulatorActions = await firstValueFrom(authStore.pipe(selectRegulatorRelatedActions));

    expect(guardResult).toEqual(true);
    expect(regulatorActions).toEqual([
      { link: ['upload-organisation-accounts'], text: 'Upload file with verified organisation accounts' },
    ]);
  });
});

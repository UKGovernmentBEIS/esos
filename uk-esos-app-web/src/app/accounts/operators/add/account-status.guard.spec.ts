import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom } from 'rxjs';

import { AccountStatusGuard } from '@accounts/index';
import { ActivatedRouteSnapshotStub, asyncData } from '@testing';

import { OrganisationAccountDTO, OrganisationAccountViewService } from 'esos-api';

import { mockedOrganisationAccount } from '../../testing/mock-data';

describe('AddUserGuard', () => {
  let guard: AccountStatusGuard;
  let router: Router;
  let organisationAccountViewService: Partial<jest.Mocked<OrganisationAccountViewService>>;

  beforeEach(() => {
    organisationAccountViewService = {
      getOrganisationAccountById: jest
        .fn()
        .mockReturnValue(asyncData<OrganisationAccountDTO>(mockedOrganisationAccount)),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [{ provide: OrganisationAccountViewService, useValue: organisationAccountViewService }],
    });
    guard = TestBed.inject(AccountStatusGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should be activated', async () => {
    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: mockedOrganisationAccount.id }))),
    ).resolves.toBeTruthy();

    await expect(organisationAccountViewService.getOrganisationAccountById).toHaveBeenCalledWith(
      mockedOrganisationAccount.id,
    );
  });

  it('should not be activated', async () => {
    const unapprovedAccount: OrganisationAccountDTO = {
      ...mockedOrganisationAccount,
      status: 'AWAITING_APPROVAL',
    };
    organisationAccountViewService.getOrganisationAccountById.mockReturnValue(
      asyncData<OrganisationAccountDTO>(unapprovedAccount),
    );

    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: mockedOrganisationAccount.id }))),
    ).resolves.toEqual(router.parseUrl(`/accounts/${mockedOrganisationAccount.id}`));

    await expect(organisationAccountViewService.getOrganisationAccountById).toHaveBeenCalledWith(
      mockedOrganisationAccount.id,
    );

    const deniedAccount: OrganisationAccountDTO = {
      ...mockedOrganisationAccount,
      status: 'DENIED',
    };
    organisationAccountViewService.getOrganisationAccountById.mockReturnValue(
      asyncData<OrganisationAccountDTO>(deniedAccount),
    );

    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: mockedOrganisationAccount.id }))),
    ).resolves.toEqual(router.parseUrl(`/accounts/${mockedOrganisationAccount.id}`));

    await expect(organisationAccountViewService.getOrganisationAccountById).toHaveBeenCalledWith(
      mockedOrganisationAccount.id,
    );
  });
});

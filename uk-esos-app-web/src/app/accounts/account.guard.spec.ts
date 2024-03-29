import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { OrganisationAccountViewService } from 'esos-api';

import { ActivatedRouteSnapshotStub, mockClass, MockType } from '../../testing';
import { AccountGuard } from './account.guard';
import { mockedOrganisationAccount } from './testing/mock-data';

describe('AccountGuard', () => {
  let guard: AccountGuard;
  let accountViewService: MockType<OrganisationAccountViewService>;

  beforeEach(() => {
    accountViewService = mockClass(OrganisationAccountViewService);
    accountViewService.getOrganisationAccountById.mockReturnValueOnce(of(mockedOrganisationAccount));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AccountGuard, { provide: OrganisationAccountViewService, useValue: accountViewService }],
    });
    guard = TestBed.inject(AccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return account details', async () => {
    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: '1' }))),
    ).resolves.toBeTruthy();

    expect(accountViewService.getOrganisationAccountById).toHaveBeenCalledWith(1);

    expect(guard.resolve()).toEqual(mockedOrganisationAccount);
  });
});

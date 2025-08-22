import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn } from '@angular/router';

import { first, map } from 'rxjs';

import { OrganisationAccountDTO, OrganisationAccountViewService } from 'esos-api';

import { AccountsStore } from './store';

export const canActivateAccount: CanActivateFn = (route) => {
  const accountsStore = inject(AccountsStore);
  const accountViewService = inject(OrganisationAccountViewService);

  return accountViewService.getOrganisationAccountById(Number(route.paramMap.get('accountId'))).pipe(
    first(),
    map((account) => {
      accountsStore.setSelectedAccount(account);
      return !!account.name;
    }),
  );
};

export const canDeactivateAccount: CanDeactivateFn<any> = () => {
  const accountsStore = inject(AccountsStore);

  accountsStore.setSelectedAccount(undefined);
  return true;
};

export const resolveAccount = (): OrganisationAccountDTO['name'] => {
  const accountsStore = inject(AccountsStore);

  return accountsStore.getState().selectedAccount.name;
};

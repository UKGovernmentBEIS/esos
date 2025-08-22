import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthStore, selectHasRegulatorPermission } from '@core/store';

export const uploadOrganisationAccountsGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.pipe(
    selectHasRegulatorPermission('MANAGE_VERIFIED_ORGANISATION_ACCOUNTS', 'EXECUTE'),
    map((hasAccess) => {
      if (hasAccess) {
        return true;
      }
      return router.parseUrl('landing');
    }),
  );
};

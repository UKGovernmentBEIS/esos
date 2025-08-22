import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { iif, map, of, switchMap, take } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@core/store';

import { RegulatorAuthoritiesService } from 'esos-api';

/**
 * Set AuthState.regulatorPermissions to API permissions
 * If RoleType === 'REGULATOR' set permissions, otherwise set to null
 */
export const accountsPageGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  return authStore.pipe(
    selectUserRoleType,
    take(1),
    switchMap((roleType) =>
      iif(
        () => roleType === 'REGULATOR',
        regulatorAuthoritiesService
          .getCurrentRegulatorUserPermissionsByCa()
          .pipe(map((authorityManagePermissionDTO) => authorityManagePermissionDTO.permissions)),
        of(null),
      ),
    ),
    map((regulatorPermissions) => {
      authStore.setRegulatorPermissions(regulatorPermissions);
      return true;
    }),
  );
};

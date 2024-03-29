import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { first, map, Observable } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@core/store';

import { UserStateDTO } from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class RoleTypeGuard implements CanActivate {
  constructor(private router: Router, private authStore: AuthStore) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const roleType = route.data.roleTypeGuards as UserStateDTO['roleType'];
    return this.authStore.pipe(
      selectUserRoleType,
      first(),
      map((authUserRoleType) => (authUserRoleType === roleType ? true : this.router.parseUrl('landing'))),
    );
  }
}

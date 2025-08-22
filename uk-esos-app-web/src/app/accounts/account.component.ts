import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, first, map } from 'rxjs';

import {
  selectHasRegulatorPermission,
  selectRegulatorPermissions,
  selectUserRoleType,
} from '@core/store/auth/auth.selectors';
import { AuthStore } from '@core/store/auth/auth.store';

import { AccountsStore } from './store';

@Component({
  selector: 'esos-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  accountDetails$ = this.accountsStore.pipe(
    first(),
    map((accounts) => accounts.selectedAccount),
  );

  userRoleType$ = this.authStore.pipe(selectUserRoleType);

  currentTab$ = new BehaviorSubject<string>(null);

  private hasAccountClosurePermission$ = this.authStore.pipe(
    selectHasRegulatorPermission('ACCOUNT_CLOSURE', 'EXECUTE'),
  );
  private regulatorPermissions$ = this.authStore.pipe(selectRegulatorPermissions);

  showStartTask$ = combineLatest([
    this.userRoleType$,
    this.hasAccountClosurePermission$,
    this.accountDetails$,
    this.regulatorPermissions$,
  ]).pipe(
    map(
      ([role, hasAccountClosurePermission, accountDetails]) =>
        accountDetails.status !== 'CLOSED' && (role !== 'REGULATOR' || hasAccountClosurePermission),
    ),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    readonly location: Location,
    readonly authStore: AuthStore,
    private readonly accountsStore: AccountsStore,
  ) {}

  selectedTab(selected: string) {
    // upon pagination queryParams is shown, for example "?page=3". In order to avoid any bug from navigation to tabs, clear query params.
    this.router.navigate([], {
      relativeTo: this.route,
      preserveFragment: true,
    });
    this.currentTab$.next(selected);
  }
}

import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { first, map } from 'rxjs';

import { OrganisationAccountSummaryComponent } from '@shared/components/organisation-account-summary';

import { AccountsStore } from '..';

@Component({
  selector: 'esos-account-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [NgIf, OrganisationAccountSummaryComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  account$ = this.accountsStore.pipe(
    first(),
    map((accounts) => accounts.selectedAccount),
  );

  constructor(private readonly accountsStore: AccountsStore) {}
}

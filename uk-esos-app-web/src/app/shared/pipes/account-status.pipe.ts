import { Pipe, PipeTransform } from '@angular/core';

import { AccountStatus } from '@shared/accounts';

@Pipe({ name: 'accountStatus' })
export class AccountStatusPipe implements PipeTransform {
  transform(status?: AccountStatus): string {
    if (!status) {
      return null;
    }

    switch (status) {
      case 'DENIED':
        return 'Denied';
      case 'LIVE':
        return 'Live';
      case 'AWAITING_APPROVAL':
        return 'Awaiting approval';
      case 'CLOSED':
        return 'Closed';
      default:
        return null;
    }
  }
}

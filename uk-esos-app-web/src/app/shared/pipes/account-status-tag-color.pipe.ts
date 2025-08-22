import { Pipe, PipeTransform } from '@angular/core';

import { AccountStatus } from '@shared/accounts';

import { TagColor } from 'govuk-components';

@Pipe({ name: 'accountStatusTagColor', pure: true, standalone: true })
export class AccountStatusTagColorPipe implements PipeTransform {
  transform(status?: AccountStatus): TagColor {
    if (!status) {
      return null;
    }

    switch (status) {
      case 'LIVE':
        return 'green';

      case 'CLOSED':
        return 'grey';

      case 'DENIED':
      case 'AWAITING_APPROVAL':
      default:
        return 'red';
    }
  }
}

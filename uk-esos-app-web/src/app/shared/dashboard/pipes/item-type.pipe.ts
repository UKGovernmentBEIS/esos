import { Pipe, PipeTransform } from '@angular/core';

import { ItemDTO } from 'esos-api';

@Pipe({ name: 'itemType' })
export class ItemTypePipe implements PipeTransform {
  transform(value: ItemDTO['requestType']): string {
    switch (value) {
      case 'ORGANISATION_ACCOUNT_OPENING':
        return 'Organisation account';
      case 'ACCOUNT_CLOSURE':
        return 'Close account';
      default:
        return null;
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'accountType' })
export class AccountTypePipe implements PipeTransform {
  transform(type: 'ORGANISATION'): string {
    switch (type) {
      case 'ORGANISATION':
        return 'Organisation';
      default:
        return null;
    }
  }
}

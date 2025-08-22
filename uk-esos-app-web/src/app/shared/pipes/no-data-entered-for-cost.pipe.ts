import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDataEnteredForCost',
  pure: true,
  standalone: true,
})
export class NoDataEnteredForCostPipe implements PipeTransform {
  transform(value?: string | number, suffix?: string): string {
    if (typeof value === 'string' && value.trim() !== '') {
      return `${value}${suffix ? ' ' + suffix : ''}`;
    }

    return 'No data entered';
  }
}

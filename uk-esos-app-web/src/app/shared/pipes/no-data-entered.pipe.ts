import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDataEntered',
  pure: true,
  standalone: true,
})
export class NoDataEnteredPipe implements PipeTransform {
  transform(value?: string | number, suffix?: string): string {
    const numericValue = parseFloat(value as string);
    if (!isNaN(numericValue)) {
      return `${numericValue}${suffix ? ' ' + suffix : ''}`;
    }

    return 'No data entered';
  }
}

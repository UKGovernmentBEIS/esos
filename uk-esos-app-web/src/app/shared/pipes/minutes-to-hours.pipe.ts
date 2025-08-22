import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours',
  standalone: true,
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value === 'number') {
      const hours = Math.floor(value / 60);
      switch (hours) {
        case 0:
          return `${value} minutes`;
        case 1:
          return '1 hour';
        default:
          return `${hours} hours`;
      }
    } else {
      return '';
    }
  }
}

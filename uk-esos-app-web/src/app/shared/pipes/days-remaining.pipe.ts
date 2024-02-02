import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysRemaining', standalone: true, pure: true })
export class DaysRemainingPipe implements PipeTransform {
  transform(days?: number): string {
    return days !== undefined && days !== null ? (days > 0 ? days.toString() : 'Overdue') : '';
  }
}

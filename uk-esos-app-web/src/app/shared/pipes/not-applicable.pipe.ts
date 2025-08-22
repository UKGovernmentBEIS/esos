import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notApplicable',
  standalone: true,
})
export class NotApplicablePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'YES':
        return 'Yes';
      case 'NO':
        return 'No';
      case 'NOT_APPLICABLE':
        return 'Not applicable';
    }
  }
}

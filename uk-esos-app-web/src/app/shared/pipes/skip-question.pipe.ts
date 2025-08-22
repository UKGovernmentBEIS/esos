import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skipQuestion',
  standalone: true,
})
export class SkipQuestionPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'YES':
        return 'Yes';
      case 'NO':
        return 'No';
      case 'SKIP_QUESTION':
        return 'Skip question';
    }
  }
}

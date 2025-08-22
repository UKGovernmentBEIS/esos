import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'internalExternal',
  standalone: true,
})
export class InternalExternalPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'INTERNAL':
        return 'Internal';
      case 'EXTERNAL':
        return 'External';
    }
  }
}

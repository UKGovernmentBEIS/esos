import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalizeFirst', standalone: true, pure: true })
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, forceLowerCase = false): string {
    return value
      ? value.charAt(0).toUpperCase() + (forceLowerCase ? value.slice(1).toLowerCase() : value.slice(1))
      : '';
  }
}

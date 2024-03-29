import { Pipe, PipeTransform } from '@angular/core';

import { Coordinates } from './coordinates';

@Pipe({ name: 'coordinate' })
export class CoordinatePipe implements PipeTransform {
  transform(value: Coordinates): string {
    return value ? `${value.degree}° ${value.minute}' ${value.second}" ${value.cardinalDirection?.toLowerCase()}` : '';
  }
}

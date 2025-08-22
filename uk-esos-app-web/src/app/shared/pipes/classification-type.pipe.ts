import { Pipe, PipeTransform } from '@angular/core';

import { OrganisationAccountDTO } from 'esos-api';

@Pipe({
  name: 'classificationType',
  standalone: true,
  pure: true,
})
export class ClassificationTypePipe implements PipeTransform {
  transform(value: OrganisationAccountDTO['type']): string {
    return value === 'OTHER' ? 'Other' : value;
  }
}

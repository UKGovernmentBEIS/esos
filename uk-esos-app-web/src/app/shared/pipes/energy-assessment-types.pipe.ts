import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'energyAssessmentTypes',
  standalone: true,
})
export class EnergyAssessmentTypesPipe implements PipeTransform {
  transform(value: string, hasNoEnergyConsumption?: boolean): string {
    switch (value) {
      case 'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME':
        return `the organisation is within scope of the scheme${
          hasNoEnergyConsumption ? ' but does not have any energy responsibility' : ''
        }`;

      case 'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME':
        return 'the organisation is compliant with the scheme';

      case 'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON':
        return 'the relevant sections of the ESOS report have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law';

      case 'SATISFIED_WITH_INFORMATION_PROVIDED':
        return 'the information provided in this notification of compliance is correct';
    }
  }
}

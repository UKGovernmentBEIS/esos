import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estimationMethodType', standalone: true, pure: true })
export class EstimationMethodTypePipe implements PipeTransform {
  transform(value: string | undefined | null, mode: 'form' | 'summary' = 'form'): string {
    switch (value) {
      case 'ENERGY_AUDIT':
        return mode === 'form' ? 'an energy audit' : 'Energy audit';
      case 'ALTERNATIVE_COMPLIANCE_METHOD':
        return mode === 'form' ? 'an alternative compliance method' : 'Alternative compliance method';
      case 'ACTION_PLAN_ESTIMATE':
        return mode === 'form' ? 'an estimate in the action plan' : 'Estimate in the action plan';
      case 'OTHER_METHOD':
      case 'OTHER_REASONABLE_ESTIMATION_METHOD':
        return mode === 'form' ? 'some other reasonable estimation method' : 'Other estimation method';
      case 'NO_METHOD_USED':
        return mode === 'form' ? 'no estimation method used' : 'No estimation method used';
      default:
        return value;
    }
  }
}

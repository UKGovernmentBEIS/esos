import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { GovukValidators, MessageValidatorFn } from 'govuk-components';

import { ComplianceRouteDistribution } from 'esos-api';

export const numberValidators: MessageValidatorFn[] = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
  GovukValidators.maxDigitsValidator(15),
];

export function valueDependentValidators(value: number): MessageValidatorFn[] {
  return [GovukValidators.max(value, 'The value should not be greater than ' + value)];
}

export function isEnergyNotAuditedBelowFivePctValidator(
  complianceRouteDistribution: ComplianceRouteDistribution,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control?.value.significantEnergyConsumptionExists === false &&
      complianceRouteDistribution.energyNotAuditedPct > 0
      ? {
          cannotSelectFalse:
            'You provided a breakdown of the total energy consumption which stated that between 1 - 5% of your ' +
            'energy use was not covered by any compliance route.  If this is correct you must answer yes to this question.' +
            'You can go back to change your answers to previous questions if they are incorrect. ',
        }
      : null;
  };
}

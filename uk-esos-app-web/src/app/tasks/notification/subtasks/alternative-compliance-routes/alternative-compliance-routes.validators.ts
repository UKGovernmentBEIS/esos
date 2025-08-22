import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import BigNumber from 'bignumber.js';
import { isAfter, isBefore } from 'date-fns';

import { GovukValidators } from 'govuk-components';

import { PotentialReductionPair } from 'esos-api';

/**
 * Validates that the "validUntil" date is later than the "validFrom" date
 * and "validUntil" date is not later than 5th of June
 */
export const validUntilLaterThanValidFromValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    const validFromValue = group.get('validFrom')?.value;
    const validUntilValue = group.get('validUntil')?.value;
    const validations: {
      invalidFromDate?: string;
      invalidUntilDate?: string;
      invalidUntilDate2?: string;
    } = {};

    // Only create Date objects if the values are truthy and not empty strings
    const validFromDate = validFromValue ? new Date(validFromValue) : null;
    const validUntilDate = validUntilValue ? new Date(validUntilValue) : null;

    if (!(validUntilDate == null || validFromDate == null || isAfter(validUntilDate, validFromDate))) {
      validations.invalidUntilDate = 'Valid until date must be later than valid from date';
    }

    if (isAfter(validFromDate, new Date('2024-06-05'))) {
      validations.invalidFromDate = 'Valid from date must be the same as or before 5 June 2024';
    }

    if (isBefore(validUntilDate, new Date('2023-12-05'))) {
      validations.invalidUntilDate2 = 'Valid until date must be the same as or after 5 December 2023';
    }

    return Object.keys(validations).length === 0 ? null : validations;
  };
};

/**
 * Validates that when cost has value greater than 0 then consumption value must be greater than 0
 */
export const reductionPairValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    const energyConsumption: PotentialReductionPair['energyConsumption'] = group.controls.energyConsumption?.value;
    const energyCost: PotentialReductionPair['energyCost'] = group.controls.energyCost?.value;
    const consumptionErrors = group.controls.energyConsumption.errors;

    if (energyConsumption === null || new BigNumber(+energyCost).isLessThan(0)) {
      return null;
    }

    const isValid =
      new BigNumber(+energyCost).isEqualTo(0) ||
      (new BigNumber(+energyCost).isGreaterThan(0) && new BigNumber(+energyConsumption).isGreaterThan(0));

    if (!isValid) {
      group.controls.energyConsumption.setErrors({
        ...consumptionErrors,
        reductionPairIsNotValid: 'Potential reduction in kWh must have a positive value',
      });
    } else {
      const { reductionPairIsNotValid, ...errors } = consumptionErrors || {};

      group.controls.energyConsumption.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }

    return null;
  };
};

export const energyConsumptionIntegerOptionalValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places'),
  GovukValidators.maxDigitsValidator(15),
];

export const energyCostNumberWithDecimalsOptionalValidators = [
  GovukValidators.min(0, 'Must be greater than or equal to 0'),
  GovukValidators.maxDecimalsValidator(2),
];

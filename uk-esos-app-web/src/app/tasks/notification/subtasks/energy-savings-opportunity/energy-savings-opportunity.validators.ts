import { GovukValidators } from 'govuk-components';

export const integerValidator = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places'),
  GovukValidators.maxDigitsValidator(15),
];

export const numberWithDecimalsValidators = [
  GovukValidators.min(0, 'Must be greater than or equal to 0'),
  GovukValidators.maxDecimalsValidator(2),
];

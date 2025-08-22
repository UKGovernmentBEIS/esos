import { GovukValidators } from 'govuk-components';

export const numberValidators = [
  GovukValidators.min(0, 'Must be integer greater than or equal to 0'),
  GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
];

export const optionalNumberValidators = [...numberValidators, GovukValidators.maxDigitsValidator(15)];

export const mandatoryNumberValidators = [
  ...optionalNumberValidators,
  GovukValidators.required('Enter a number equal to or greater than 0'),
];

import { UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

/**
 * Validator for OtherTypeName, engages when type === 'OTHER' and otherTypeName is empty
 */
export const otherTypeNameRequiredConditionallyValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors => {
    const typeIsOther = group.controls.type.value === 'OTHER';
    const otherTypeNameCtrl = group.controls.otherTypeName;
    const otherTypeNameInvalid =
      otherTypeNameCtrl.value === null || otherTypeNameCtrl.value === undefined || otherTypeNameCtrl.value === '';

    typeIsOther && otherTypeNameInvalid
      ? otherTypeNameCtrl.setErrors({ otherTypeNameInvalid: 'Enter a classification name' })
      : otherTypeNameCtrl.setErrors(null);

    return null;
  };
};

export const activityCodeValidators = [
  GovukValidators.required('Enter a code'),
  GovukValidators.maxLength(255, 'Code should not be larger than 255 characters'),
];
export const typeValidators = [GovukValidators.required('Enter a classification type')];

export const otherTypeNameValidators = [
  GovukValidators.maxLength(255, 'Classification name should not be larger than 255 characters'),
];

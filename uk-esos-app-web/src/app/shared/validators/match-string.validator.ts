import { FormControl, ValidatorFn } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

export const stringsMustNotMatchValidator = (message: string, comparisonString: string): ValidatorFn =>
  GovukValidators.builder(message, (control: FormControl<string>): { [key: string]: boolean } | null => {
    if (comparisonString === control.value) {
      return { stringsMustNotMatch: true };
    }
    return null;
  });

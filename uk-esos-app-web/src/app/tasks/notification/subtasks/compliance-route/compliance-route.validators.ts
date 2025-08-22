import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exclusiveCheckedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control?.value?.includes('NONE_OF_THE_ABOVE') && control?.value?.length > 1
      ? { noneChecked: 'Select the calculations for which you used estimates, or select ‘None of the above’' }
      : null;
  };
}

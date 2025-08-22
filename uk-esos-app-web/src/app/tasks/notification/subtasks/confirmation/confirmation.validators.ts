import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { reviewAssessmentCannotBeBefore } from '@tasks/notification/subtasks/confirmation/confirmation.helper';
import { isAfter } from 'date-fns';

export function allCheckedValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return length !== control?.value?.length ? { notAllChecked: 'Select all declaration notes' } : null;
  };
}

export function sameResponsibleOfficerEmailValidator(firstResponsibleOfficerEmail: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    if (firstResponsibleOfficerEmail === control.value) {
      return { sameEmail: 'Each director must have a different email address' };
    }
    return null;
  };
}

/**
 * Validates that the input date is after 6th December 2019.
 */
export const dateAfterDecSixValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDateValue = control.value;
    const inputDate = inputDateValue ? new Date(inputDateValue) : null;

    if (inputDate && !isAfter(inputDate, reviewAssessmentCannotBeBefore)) {
      return { invalidDate: 'The date must be the same as or after 6 December 2019' };
    }

    return null;
  };
};

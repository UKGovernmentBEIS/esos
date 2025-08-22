import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates a validator that checks if all form controls within a FormGroup either have a value or none do.
 * It applies a specific error message to each control that fails this validation condition.
 * If some but not all fields are filled, the specified error messages are applied to each empty control.
 * Additionally, this validator sets a dummy error at the group level to indicate the group is invalid,
 * even though the actual error messages are applied at the individual control level.
 *
 * @param {Object} errorMessages An object mapping form control names to error messages.
 * This object specifies the error message to display for each control when the validation fails.
 * @returns {ValidatorFn} A validator function that takes an AbstractControl instance (expected to be a FormGroup)
 * and returns an object with validation errors if the validation fails, or null if it passes.
 */
export function allOrNoneGroupValidator(errorMessages: { [key: string]: string }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) return null;

    const formGroup = control as FormGroup;
    const controls = formGroup.controls;
    const controlNames = Object.keys(controls);

    // Determine if all or none of the controls have values
    const values = Object.values(controls).map((c) => c.value);
    const allHaveValues = values.every((value) => value != null && value !== '');
    const noneHaveValues = values.every((value) => value == null || value === '');

    if (allHaveValues || noneHaveValues) {
      // If all or none have values, ensure no related errors are present on individual controls
      controlNames.forEach((name) => {
        const errors = controls[name].errors;
        if (errors) {
          // Remove the specific error related to this validation logic if it exists
          delete errors['allOrNone'];
          if (Object.keys(errors).length === 0) controls[name].setErrors(null);
          else controls[name].setErrors(errors);
        }
      });
      return null;
    } else {
      // If some but not all controls have values, apply the specific error to each control
      controlNames.forEach((name) => {
        const value = controls[name].value;
        if (value == null || value === '') {
          controls[name].setErrors({ ...controls[name].errors, allOrNone: errorMessages[name] });
        }
      });
      // Returning a dummy error at the group level to indicate the group is invalid
      // even though the real logic applies errors at the control level
      return { allOrNoneGroupError: null };
    }
  };
}

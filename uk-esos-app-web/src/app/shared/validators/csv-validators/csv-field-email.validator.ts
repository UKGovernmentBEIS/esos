import { FormArray, ValidatorFn, Validators } from '@angular/forms';

/**
 * Validates a CSV field according to its email validity
 * Returns the column and row the error was found at
 */
export function csvFieldEmailValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  message: string,
  optional = true,
): ValidatorFn {
  return (control: FormArray): { [key: string]: any } | null => {
    if (!control.length) {
      return null;
    }

    const errorMessageRows = [];

    control?.controls?.forEach((dataRow, index) => {
      const currentField = dataRow.get(field.toString());

      if (optional && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (Validators.email(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldEmail' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message,
        },
      };
    }

    return null;
  };
}

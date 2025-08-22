import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field according to a regex pattern
 * Returns the column and row the error was found at
 */
export function csvFieldPatternValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  pattern: RegExp,
  message: string,
  optional = true,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];

      if (optional && (currentField === null || currentField === undefined)) {
        return null;
      }

      if (!pattern.test(currentField)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldPattern' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message,
        },
      };
    }

    return null;
  };
}

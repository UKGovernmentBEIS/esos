import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field as unique across different rows, but for the same column
 * Returns the column and row the error was found at
 */
export function csvFieldDuplicateValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  message: string,
  ignoreNull = false,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];
    const combinations = new Map<string, number[]>();

    data.forEach((entry, index) => {
      const key = entry?.[field];

      if (ignoreNull === true && key === null) {
        return;
      }

      const existingRows = combinations.get(key);
      if (existingRows) {
        existingRows.push(index + 1);
      } else {
        combinations.set(key, [index + 1]);
      }
    });

    combinations.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((rowIndex) => {
          errorMessageRows.push({
            rowIndex: rowIndex,
          });
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldDuplicate' + field.toString()]: {
          rows: errorMessageRows,
          columns: [csvMap?.[field]],
          message: message,
        },
      };
    }

    return null;
  };
}

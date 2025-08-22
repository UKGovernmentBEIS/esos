import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field as boolean.
 * If required = true, prioritize missing values over invalid values
 * Returns the column and row the error was found at
 */
export function csvFieldBooleanValidator<T>(
  field: keyof T,
  csvMap: Record<keyof T, string>,
  required = false,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const missingValuesMessageRows = [];
    const invalidValuesMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (required && (currentField === undefined || currentField === null || currentField === '')) {
        missingValuesMessageRows.push({
          rowIndex: index + 1,
        });
      }
      if (currentField !== true && currentField !== false) {
        invalidValuesMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (missingValuesMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldRequired' + field.toString()]: {
          rows: missingValuesMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has one or more values missing`,
        },
      };
    }

    if (invalidValuesMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldBoolean' + field.toString()]: {
          rows: invalidValuesMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has invalid values`,
        },
      };
    }

    return null;
  };
}

import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV field as required
 * Returns the column and row the error was found at
 */
export function csvFieldRequiredValidator<T>(field: keyof T, csvMap: Record<keyof T, string>): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      if (currentField === undefined || currentField === null || currentField?.length === 0) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      const columnHeader = csvMap?.[field];
      return {
        ['csvFieldRequired' + field.toString()]: {
          rows: errorMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has one or more values missing`,
        },
      };
    }

    return null;
  };
}

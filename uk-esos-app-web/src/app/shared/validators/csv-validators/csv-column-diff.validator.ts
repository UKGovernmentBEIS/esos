import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV file for its columns
 * Returns the column and row the error was found at
 */
export function csvColumnDiffValidator<T>(csvMap: Record<keyof T, string>): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    const error = {
      ['csvColumnDiff']: {
        rows: null,
        columns: null,
        message: 'The header names cannot be different than the ones included in the template',
      },
    };

    if (!Array.isArray(data)) {
      return error;
    }

    const mapKeys = Object.keys(csvMap);
    for (const key of mapKeys) {
      if (!data.includes(csvMap?.[key])) {
        return error;
      }
    }

    return null;
  };
}

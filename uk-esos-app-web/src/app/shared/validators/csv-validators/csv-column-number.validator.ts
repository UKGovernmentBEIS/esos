import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Validates a CSV file for its columns
 * Returns the column and row the error was found at
 */
export function csvColumnNumberValidator<T>(csvMap: Record<keyof T, string>): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    const mapKeys = Object.keys(csvMap);

    if (data?.length !== mapKeys.length) {
      return {
        ['csvColumnNumber']: {
          rows: null,
          columns: null,
          message: `The file should include ${mapKeys.length} columns`,
        },
      };
    }

    return null;
  };
}

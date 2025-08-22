import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

/**
 * Validates type (classificationType) CSV field
 * If areSameAsRU === true then bypasses validation
 * Prioritizes missing values over invalid values
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrClassificationTypeValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    const field = 'type';

    if (!Array.isArray(data)) {
      return null;
    }

    const missingValuesMessageRows = [];
    const invalidValuesMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      const requiresValidation = dataRow['areSameAsRU'] === false;

      if (!requiresValidation) {
        return;
      }

      if (requiresValidation && (currentField === undefined || currentField === null || currentField === '')) {
        missingValuesMessageRows.push({
          rowIndex: index + 1,
        });
      }

      if (requiresValidation && currentField !== 'SIC' && currentField !== 'OTHER') {
        invalidValuesMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (missingValuesMessageRows.length > 0) {
      const columnHeader = organisationStructureCsvMap?.[field];
      return {
        ['csvFieldRequired' + field]: {
          rows: missingValuesMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has one or more values missing`,
        },
      };
    }

    if (invalidValuesMessageRows.length > 0) {
      const columnHeader = organisationStructureCsvMap?.[field];
      return {
        ['csvFieldBoolean' + field]: {
          rows: invalidValuesMessageRows,
          columns: [columnHeader],
          message: `The field '${columnHeader}' has invalid values`,
        },
      };
    }

    return null;
  };
}

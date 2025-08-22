import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

/**
 * Validates classification name (otherTypeName) CSV field
 * If type !== 'OTHER' then bypasses validation
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrClassificationNameValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;
    const field = 'otherTypeName';

    if (!Array.isArray(data)) {
      return null;
    }

    const missingValuesMessageRows = [];

    data.forEach((dataRow, index) => {
      const currentField = dataRow[field];
      const requiresValidation = dataRow['type'] === 'OTHER';

      if (!requiresValidation) {
        return;
      }

      if (requiresValidation && (currentField === undefined || currentField === null || currentField === '')) {
        missingValuesMessageRows.push({
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

    return null;
  };
}

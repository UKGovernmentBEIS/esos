import { FormControl, ValidatorFn } from '@angular/forms';

import { organisationStructureCsvMap } from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';

/**
 * Validates that CSV field does not have
 * Returns the column and row the error was found at
 */
export function csvFieldOrgStrParentSubsidiaryEqualityValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const invalidMessageRows = [];

    data.forEach((dataRow, index) => {
      if (
        dataRow['isParentOfResponsibleUndertaking'] === true &&
        dataRow['isSubsidiaryOfResponsibleUndertaking'] === true
      ) {
        invalidMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (invalidMessageRows.length > 0) {
      return {
        ['csvFieldOrganisationSubsidiaryEquality']: {
          rows: invalidMessageRows,
          columns: [
            organisationStructureCsvMap?.isParentOfResponsibleUndertaking,
            organisationStructureCsvMap?.isSubsidiaryOfResponsibleUndertaking,
          ],
          message:
            'An organisation cannot be a parent and a subsidiary of the responsible undertaking at the same time',
        },
      };
    }

    return null;
  };
}

import { Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { organisationAccountsCsvMap } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.map';
import {
  csvColumnDiffValidator,
  csvColumnNumberValidator,
  csvFieldDuplicateValidator,
  csvFieldEmptyRowValidator,
  csvFieldPatternValidator,
  csvFieldRequiredValidator,
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  maxFileSizeValidator,
} from '@shared/validators';
import { csvFieldEmailValidator } from '@shared/validators/csv-validators/csv-field-email.validator';
import { TASK_FORM } from '@tasks/task-form.token';

import { OrganisationAccountOnboardingRegistryDTO } from 'esos-api';

export interface OrganisationAccountFormModel {
  registrationNumber: FormControl<string | null>;
  email: FormControl<string | null>;
}

export type OrganisationAccountsFormArray = FormArray<FormGroup<OrganisationAccountFormModel>>;

export interface UploadOrganisationAccountsFormModel {
  organisationAccountsDetails: OrganisationAccountsFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

export const uploadOrganisationAccountsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (fb: FormBuilder) => {
    return fb.group<UploadOrganisationAccountsFormModel>(
      {
        organisationAccountsDetails: fb.array([] as FormGroup<OrganisationAccountFormModel>[]),
        columns: fb.control(null, {
          updateOn: 'change',
          validators: [
            csvColumnNumberValidator(organisationAccountsCsvMap),
            csvColumnDiffValidator(organisationAccountsCsvMap),
          ],
        }),
        file: fb.control(null, {
          updateOn: 'change',
          validators: [
            fileExtensionValidator(
              ['csv'],
              ['text/csv', 'application/vnd.ms-excel'],
              'The selected file must be a CSV',
            ),
            maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
            fileNameLengthValidator(
              100,
              'The selected file must must have a file name length less than 100 characters',
            ),
            emptyFileValidator('The selected file cannot be empty'),
          ],
        }),
      },
      { updateOn: 'change' },
    );
  },
};

export const addOrganisationAccountDetailsGroup = (
  organisationAccountDetails: OrganisationAccountOnboardingRegistryDTO,
): FormGroup<OrganisationAccountFormModel> => {
  return new FormGroup<OrganisationAccountFormModel>({
    registrationNumber: new FormControl<string | null>(organisationAccountDetails?.registrationNumber ?? null),
    email: new FormControl<string | null>(organisationAccountDetails?.email ?? null),
  });
};

export const uploadOrganisationAccountsValidators = [
  csvFieldEmptyRowValidator(),
  csvFieldRequiredValidator('registrationNumber', organisationAccountsCsvMap),
  csvFieldPatternValidator(
    'registrationNumber',
    organisationAccountsCsvMap,
    new RegExp('^(?:\\d{8}|[A-Z]\\d{7}|[A-Z]{2}\\d{5}[A-Z0-9])$'),
    `The field '${organisationAccountsCsvMap.registrationNumber}' must be either 8 digits, 1 letter followed by 7 digits, 2 letters followed by 6 digits or 2 letters followed by 5 digits followed by a final letter. If your Company Registration Number has less than 8 digits then you may need to add zeros at the beginning`,
  ),
  csvFieldDuplicateValidator(
    'registrationNumber',
    organisationAccountsCsvMap,
    'There are duplicated registration numbers in the file',
  ),
  csvFieldRequiredValidator('email', organisationAccountsCsvMap),
  csvFieldEmailValidator(
    'email',
    organisationAccountsCsvMap,
    `Enter an email address in the correct format, like name@example.com`,
    false,
  ),
  csvFieldDuplicateValidator('email', organisationAccountsCsvMap, 'There are duplicated user emails in the file'),
];

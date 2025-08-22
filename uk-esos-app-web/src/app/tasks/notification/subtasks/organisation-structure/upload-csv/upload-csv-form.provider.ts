import { Provider } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import {
  csvColumnDiffValidator,
  csvColumnNumberValidator,
  csvFieldBooleanValidator,
  csvFieldDuplicateValidator,
  csvFieldEmptyRowValidator,
  csvFieldMaxLengthValidator,
  csvFieldPatternValidator,
  csvFieldRequiredValidator,
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  maxFileSizeValidator,
} from '@shared/validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  FlattenedOrganisationAssociatedWithRU,
  organisationStructureCsvMap,
} from '@tasks/notification/subtasks/organisation-structure/upload-csv/organisation-structure-csv.map';
import {
  csvFieldOrgStrClassificationNameValidator,
  csvFieldOrgStrClassificationTypeValidator,
  csvFieldOrgStrCodeFirstValidator,
  csvFieldOrgStrParentSubsidiaryEqualityValidator,
  csvFieldOrgStrRegistrationNumberValidator,
} from '@tasks/notification/subtasks/organisation-structure/upload-csv/validators';
import { TASK_FORM } from '@tasks/task-form.token';

/**
 * Form based on FlattenedOrganisationAssociatedWithRU.
 * Since CSV cannot pass as object, we flatten it then transform it to OrganisationsAssociatedWithRU
 */
export interface OrganisationsAssociatedWithRUFormModel {
  organisationName: FormControl<string | null>;
  registrationNumber: FormControl<string | null>;
  isPartOfArrangement: FormControl<boolean | null>;
  isParentOfResponsibleUndertaking: FormControl<boolean | null>;
  isSubsidiaryOfResponsibleUndertaking: FormControl<boolean | null>;
  isPartOfFranchise: FormControl<boolean | null>;
  hasCeasedToBePartOfGroup: FormControl<boolean | null>;
  areSameAsRU: FormControl<boolean | null>;
  type: FormControl<'SIC' | 'OTHER' | null>;
  otherTypeName: FormControl<string | null>;
  code1: FormControl<string | null>;
  code2: FormControl<string | null>;
  code3: FormControl<string | null>;
  code4: FormControl<string | null>;
}

export type OrganisationsRUFormArray = FormArray<FormGroup<OrganisationsAssociatedWithRUFormModel>>;

export interface UploadCSVFormModel {
  organisationsRU: OrganisationsRUFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

export const uploadCsvFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    const registrationNumberRU = store.select(notificationQuery.selectResponsibleUndertaking)()?.organisationDetails
      ?.registrationNumber;

    return fb.group<UploadCSVFormModel>({
      organisationsRU: fb.array([] as FormGroup<OrganisationsAssociatedWithRUFormModel>[], {
        updateOn: 'change',
        validators: uploadCSVFormValidators(registrationNumberRU),
      }),
      columns: fb.control(null, {
        updateOn: 'change',
        validators: [
          csvColumnNumberValidator(organisationStructureCsvMap),
          csvColumnDiffValidator(organisationStructureCsvMap),
        ],
      }),
      file: fb.control(null, {
        updateOn: 'change',
        validators: [
          fileExtensionValidator(['csv'], ['text/csv', 'application/vnd.ms-excel'], 'The selected file must be a CSV'),
          maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
          fileNameLengthValidator(100, 'The selected file must must have a file name length less than 100 characters'),
          emptyFileValidator('The selected file cannot be empty'),
        ],
      }),
    });
  },
};

export const addOrganisationRUGroup = (
  organisationAssociatedWithRU: FlattenedOrganisationAssociatedWithRU,
): FormGroup<OrganisationsAssociatedWithRUFormModel> => {
  return new FormGroup<OrganisationsAssociatedWithRUFormModel>({
    organisationName: new FormControl<string | null>(organisationAssociatedWithRU?.organisationName ?? null),
    registrationNumber: new FormControl<string | null>(organisationAssociatedWithRU?.registrationNumber ?? null),
    isPartOfArrangement: new FormControl<boolean | null>(organisationAssociatedWithRU?.isPartOfArrangement ?? null),
    isParentOfResponsibleUndertaking: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.isParentOfResponsibleUndertaking ?? null,
    ),
    isSubsidiaryOfResponsibleUndertaking: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.isSubsidiaryOfResponsibleUndertaking ?? null,
    ),
    isPartOfFranchise: new FormControl<boolean | null>(organisationAssociatedWithRU?.isPartOfFranchise ?? null),
    hasCeasedToBePartOfGroup: new FormControl<boolean | null>(
      organisationAssociatedWithRU?.hasCeasedToBePartOfGroup ?? null,
    ),
    areSameAsRU: new FormControl<boolean | null>(organisationAssociatedWithRU?.areSameAsRU ?? null),
    type: new FormControl<'SIC' | 'OTHER' | null>(organisationAssociatedWithRU?.type ?? null),
    otherTypeName: new FormControl<string | null>(organisationAssociatedWithRU?.otherTypeName ?? null),
    code1: new FormControl<string | null>(organisationAssociatedWithRU?.code1 ?? null),
    code2: new FormControl<string | null>(organisationAssociatedWithRU?.code2 ?? null),
    code3: new FormControl<string | null>(organisationAssociatedWithRU?.code3 ?? null),
    code4: new FormControl<string | null>(organisationAssociatedWithRU?.code4 ?? null),
  });
};

export const uploadCSVFormValidators = (registrationNumberRU: string) => [
  csvFieldEmptyRowValidator(),

  // organisationName
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>(
    'organisationName',
    organisationStructureCsvMap,
    255,
  ),
  csvFieldRequiredValidator<FlattenedOrganisationAssociatedWithRU>('organisationName', organisationStructureCsvMap),

  // registrationNumber
  csvFieldPatternValidator<FlattenedOrganisationAssociatedWithRU>(
    'registrationNumber',
    organisationStructureCsvMap,
    new RegExp('^(?:\\d{8}|[A-Z]\\d{7}|[A-Z]{2}\\d{5}[A-Z0-9])$'),
    `The Company Registration Number must be either 8 digits, 1 letter followed by 7 digits, 2 letters followed by 6 digits or 2 letters followed by 5 digits followed by a final letter. If your Company Registration Number has less than 8 digits then you may need to add zeros at the beginning`,
    true,
  ),
  csvFieldDuplicateValidator<FlattenedOrganisationAssociatedWithRU>(
    'registrationNumber',
    organisationStructureCsvMap,
    'There are duplicated organisation registration numbers in the file',
    true,
  ),
  csvFieldOrgStrRegistrationNumberValidator(
    'registrationNumber',
    registrationNumberRU,
    'There is an organisation with the same registration number as the one of the responsible undertaking',
  ),

  // isPartOfArrangement
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>(
    'isPartOfArrangement',
    organisationStructureCsvMap,
    true,
  ),

  // hasCeasedToBePartOfGroup
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>(
    'hasCeasedToBePartOfGroup',
    organisationStructureCsvMap,
    true,
  ),

  // isPartOfFranchise
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>(
    'isPartOfFranchise',
    organisationStructureCsvMap,
    true,
  ),

  // isParentOfResponsibleUndertaking
  csvFieldOrgStrParentSubsidiaryEqualityValidator(),
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>(
    'isParentOfResponsibleUndertaking',
    organisationStructureCsvMap,
    true,
  ),

  // isSubsidiaryOfResponsibleUndertaking
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>(
    'isSubsidiaryOfResponsibleUndertaking',
    organisationStructureCsvMap,
    true,
  ),

  // areSameAsRU
  csvFieldBooleanValidator<FlattenedOrganisationAssociatedWithRU>('areSameAsRU', organisationStructureCsvMap, true),

  // type
  csvFieldOrgStrClassificationTypeValidator(),

  // otherTypeName
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>('otherTypeName', organisationStructureCsvMap, 255),
  csvFieldOrgStrClassificationNameValidator(),

  // code1
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>('code1', organisationStructureCsvMap, 255),
  csvFieldOrgStrCodeFirstValidator(),

  // code2
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>('code2', organisationStructureCsvMap, 255),

  // code3
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>('code3', organisationStructureCsvMap, 255),

  // code4
  csvFieldMaxLengthValidator<FlattenedOrganisationAssociatedWithRU>('code4', organisationStructureCsvMap, 255),
];

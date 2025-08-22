import { Provider } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { addCodeFormControl } from '@shared/components/activity-codes-input/activity-codes-input';
import {
  otherTypeNameRequiredConditionallyValidator,
  otherTypeNameValidators,
  typeValidators,
} from '@shared/components/activity-codes-input/activity-codes-input.validators';
import { sortOrganisations } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.helper';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationAssociatedWithRU } from 'esos-api';

export const addEditFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, ActivatedRoute, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, route: ActivatedRoute, store: RequestTaskStore) => {
    let editOrganisation: OrganisationAssociatedWithRU;
    const index = +route.snapshot.params.index;

    if (index) {
      editOrganisation = sortOrganisations(
        store.select(notificationQuery.selectOrganisationStructure)().organisationsAssociatedWithRU,
      ).find((_, i) => i === index - 1);
    }

    const codes = editOrganisation?.classificationCodesDetails?.codes?.codes ?? [];
    const codeFormControls = codes.length > 0 ? codes.map((code) => addCodeFormControl(code)) : [addCodeFormControl()];

    return fb.group(
      {
        registrationNumberExist: [
          editOrganisation?.registrationNumberExist ?? null,
          GovukValidators.required('Please select an option'),
        ],
        registrationNumber: [
          editOrganisation?.registrationNumber ?? null,
          [
            GovukValidators.required('Enter the registration number'),
            GovukValidators.pattern(
              '^(?:\\d{8}|[A-Z]\\d{7}|[A-Z]{2}\\d{5}[A-Z0-9])$',
              'The Company Registration Number must be either 8 digits, 1 letter followed by 7 digits, 2 letters followed by 6 digits or 2 letters followed by 5 digits followed by a final letter. If your Company Registration Number has less than 8 digits then you may need to add zeros at the beginning',
            ),
          ],
        ],
        organisationName: [
          editOrganisation?.organisationName ?? null,
          [
            GovukValidators.required('Enter the organisation name'),
            GovukValidators.maxLength(255, 'Organisation number should not be larger than 255 characters'),
          ],
        ],
        areSameAsRU: [editOrganisation?.classificationCodesDetails?.areSameAsRU ? [true] : [false]],
        type: [
          {
            value: editOrganisation?.classificationCodesDetails?.codes?.type,
            disabled: editOrganisation?.classificationCodesDetails?.areSameAsRU === true,
          },
          typeValidators,
        ],
        otherTypeName: [
          {
            value: editOrganisation?.classificationCodesDetails?.codes?.otherTypeName ?? null,
            disabled: editOrganisation?.classificationCodesDetails?.areSameAsRU === true,
          },
          otherTypeNameValidators,
        ],
        codes: fb.array(codeFormControls),
        isPartOfArrangement: [
          editOrganisation?.isPartOfArrangement ?? null,
          GovukValidators.required('Select yes if 2 or more parent groups are complying as one participant'),
        ],
        isParentOfResponsibleUndertaking: [
          editOrganisation?.isParentOfResponsibleUndertaking ?? null,
          GovukValidators.required('Select yes if the organisation is a parent of the responsible undertaking'),
        ],
        isSubsidiaryOfResponsibleUndertaking: [
          editOrganisation?.isSubsidiaryOfResponsibleUndertaking ?? null,
          GovukValidators.required('Select yes if the organisation is a subsidiary of the responsible undertaking'),
        ],
        isPartOfFranchise: [
          editOrganisation?.isPartOfFranchise ?? null,
          GovukValidators.required('Select yes if the organisation is part of a franchise group'),
        ],
        hasCeasedToBePartOfGroup: [
          editOrganisation?.hasCeasedToBePartOfGroup ?? null,
          GovukValidators.required(
            'Select yes if this organisation was not part of the corporate group during the compliance period',
          ),
        ],
      },
      {
        updateOn: 'change',
        validators: [otherTypeNameRequiredConditionallyValidator(), organisationParentSubsidiaryValidator()],
      },
    );
  },
};

const organisationParentSubsidiaryValidator = (): ValidatorFn => {
  return (group: UntypedFormGroup): ValidationErrors | null => {
    return group.controls.isParentOfResponsibleUndertaking.value &&
      group.controls.isSubsidiaryOfResponsibleUndertaking.value
      ? {
          parentOrSubsidiaryChecked:
            'An organisation cannot be a parent and a subsidiary of the responsible undertaking at the same time.',
        }
      : null;
  };
};

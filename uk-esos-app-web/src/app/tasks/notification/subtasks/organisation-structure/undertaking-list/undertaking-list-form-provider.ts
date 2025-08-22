import { Provider } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { OrganisationUndertakingDetails } from 'esos-api';

export const undertakingListFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const organisationUndertakingDetails =
      store.select(notificationQuery.selectOrganisationStructure)()?.organisationUndertakingDetails ?? [];

    const organisationFormControls =
      organisationUndertakingDetails.length > 0
        ? organisationUndertakingDetails.map((details) => addOrganisationUndertakingDetails(details))
        : [addOrganisationUndertakingDetails()];

    return fb.group({
      organisations: fb.array(organisationFormControls),
    });
  },
};

export const addOrganisationUndertakingDetails = (
  organisationAccountDetails?: OrganisationUndertakingDetails,
): FormGroup => {
  return new FormGroup({
    organisationName: new FormControl<string | null>(organisationAccountDetails?.organisationName ?? null, [
      GovukValidators.required('Enter organisation name'),
      GovukValidators.maxLength(255, 'Organisation name should not be larger than 255 characters'),
    ]),
    registrationNumber: new FormControl<string | null>(organisationAccountDetails?.registrationNumber ?? null, [
      GovukValidators.maxLength(255, 'Company registration number should not be larger than 255 characters'),
    ]),
  });
};

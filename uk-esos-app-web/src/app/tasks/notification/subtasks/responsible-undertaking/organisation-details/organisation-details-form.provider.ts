import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { otherTypeNameRequiredConditionallyValidator } from '@shared/components/activity-codes-input/activity-codes-input.validators';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const organisationDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectResponsibleUndertaking);
    const originatedOrganisationDetails = store.select(notificationQuery.selectAccountOriginatedData)()
      ?.organisationDetails;

    const organisationDetails = state()?.organisationDetails;

    /**
     * Map existing Codes[] to FormArray.
     * If none found create at least one FormGroup in FormArray
     */
    const codes = organisationDetails?.codes ?? originatedOrganisationDetails?.codes;
    const codeFormControls =
      codes?.length > 0 ? codes?.map((code) => addCodeFormControl(code)) : [addCodeFormControl()];

    return fb.group(
      {
        name: [
          organisationDetails?.name ?? originatedOrganisationDetails?.name,
          [
            GovukValidators.required('Enter the registered name of the organisation'),
            GovukValidators.maxLength(255, 'The registered name should not be more than 255 characters'),
          ],
        ],
        type: [
          organisationDetails?.type ?? originatedOrganisationDetails?.type,
          [GovukValidators.required('Enter a classification type')],
        ],
        otherTypeName: [organisationDetails?.otherTypeName ?? originatedOrganisationDetails?.otherTypeName],
        codes: fb.array(codeFormControls),
        ...CountyAddressInputComponent.controlsFactory(
          organisationDetails?.line1 ? organisationDetails : originatedOrganisationDetails,
        ),
      },
      { updateOn: 'change', validators: [otherTypeNameRequiredConditionallyValidator()] },
    );
  },
};

export const addCodeFormControl = (code?: string): UntypedFormControl => {
  return new UntypedFormControl(code ?? null, { validators: [GovukValidators.required('Enter a code')] });
};

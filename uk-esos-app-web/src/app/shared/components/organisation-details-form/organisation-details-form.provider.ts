import { UntypedFormBuilder } from '@angular/forms';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { addCodeFormControl } from '@shared/components/activity-codes-input/activity-codes-input';
import {
  otherTypeNameRequiredConditionallyValidator,
  otherTypeNameValidators,
  typeValidators,
} from '@shared/components/activity-codes-input/activity-codes-input.validators';
import {
  ORGANISATION_ACCOUNT_STATE_PROVIDER,
  OrganisationAccountStateProvider,
} from '@shared/providers/organisation-account.state.provider';

import { GovukValidators } from 'govuk-components';

export const organisationDetailsFormProvider = {
  provide: ORGANISATION_ACCOUNT_FORM,
  deps: [UntypedFormBuilder, ORGANISATION_ACCOUNT_STATE_PROVIDER],
  useFactory: (fb: UntypedFormBuilder, stateProvider: OrganisationAccountStateProvider) => {
    const address = stateProvider.address;
    const codes = stateProvider.codes;

    /**
     * Map existing Codes[] to FormArray.
     * If none found create at least one FormGroup in FormArray
     */
    const codeFormControls =
      codes?.length > 0 ? codes?.map((code) => addCodeFormControl(code)) : [addCodeFormControl()];

    return fb.group(
      {
        registeredName: [
          stateProvider.name,
          [
            GovukValidators.required('Enter the registered name of the organisation'),
            GovukValidators.maxLength(255, 'The registered name should not be more than 255 characters'),
          ],
        ],
        type: [stateProvider.type, typeValidators],
        otherTypeName: [stateProvider.otherTypeName, otherTypeNameValidators],
        codes: fb.array(codeFormControls),
        addressDetails: fb.group({
          line1: [
            address?.line1 ?? null,
            [
              GovukValidators.required('Enter address line 1, typically the building and street'),
              GovukValidators.maxLength(255, 'The line 1 should not be more than 255 characters'),
            ],
          ],
          line2: [
            address?.line2 ?? null,
            GovukValidators.maxLength(255, 'The line 2 should not be more than 255 characters'),
          ],
          city: [
            address?.city ?? null,
            [
              GovukValidators.required('Enter your town or city name'),
              GovukValidators.maxLength(255, 'The town or city name should not be more than 255 characters'),
            ],
          ],
          county: [address?.county ?? null],
          postcode: [
            address?.postcode ?? null,
            [
              GovukValidators.required('Enter your postcode'),
              GovukValidators.maxLength(64, 'The postcode should not be more than 64 characters'),
            ],
          ],
        }),
      },
      { updateOn: 'change', validators: [otherTypeNameRequiredConditionallyValidator()] },
    );
  },
};

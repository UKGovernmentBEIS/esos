import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { phoneInputValidators } from '@shared/phone-input/phone-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const organisationContactDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectResponsibleUndertaking);
    const organisationContactDetails = state()?.organisationContactDetails;

    return fb.group(
      {
        email: [
          organisationContactDetails?.email ?? null,
          [
            GovukValidators.required(`Enter the email address`),
            GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
          ],
        ],
        phoneNumber: [
          {
            countryCode: organisationContactDetails?.phoneNumber?.countryCode ?? '44',
            number: organisationContactDetails?.phoneNumber?.number ?? null,
          },
          phoneInputValidators,
        ],
      },
      { updateOn: 'change' },
    );
  },
};

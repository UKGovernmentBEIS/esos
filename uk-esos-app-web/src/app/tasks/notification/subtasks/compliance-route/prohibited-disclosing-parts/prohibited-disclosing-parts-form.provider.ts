import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const prohibitedDisclosingPartsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const partsProhibitedFromDisclosing = store.select(notificationQuery.selectComplianceRoute)()
      ?.partsProhibitedFromDisclosing;

    return fb.group({
      partsProhibitedFromDisclosing: [
        partsProhibitedFromDisclosing,
        [
          GovukValidators.required(
            'Enter the information that the responsible undertaking is prohibited from disclosing',
          ),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ],
    });
  },
};

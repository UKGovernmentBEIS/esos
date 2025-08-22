import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const prohibitedDisclosingReasonFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const partsProhibitedFromDisclosingReason = store.select(notificationQuery.selectComplianceRoute)()
      ?.partsProhibitedFromDisclosingReason;

    return fb.group({
      partsProhibitedFromDisclosingReason: [
        partsProhibitedFromDisclosingReason,
        [
          GovukValidators.required('Enter the reason that disclosure of this information is prohibited'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ],
    });
  },
};

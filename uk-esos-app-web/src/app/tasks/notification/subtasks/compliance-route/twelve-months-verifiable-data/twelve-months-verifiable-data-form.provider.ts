import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const twelveMonthsVerifiableDataFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const twelveMonthsVerifiableDataUsed = store.select(notificationQuery.selectComplianceRoute)()
      ?.areTwelveMonthsVerifiableDataUsed;
    const twelveMonthsVerifiableDataUsedReason = store.select(notificationQuery.selectComplianceRoute)()
      ?.twelveMonthsVerifiableDataUsedReason;

    return fb.group(
      {
        areTwelveMonthsVerifiableDataUsed: [
          twelveMonthsVerifiableDataUsed,
          GovukValidators.required('Select an option'),
        ],
        twelveMonthsVerifiableDataUsedReason: [
          twelveMonthsVerifiableDataUsedReason ?? null,
          [
            GovukValidators.required('Please provide details'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        ],
      },
      { updateOn: 'change' },
    );
  },
};

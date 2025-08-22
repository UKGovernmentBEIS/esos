import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const tradingDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const tradingDetails = store.select(notificationQuery.selectResponsibleUndertaking)()?.tradingDetails;

    return fb.group(
      {
        exist: [tradingDetails?.exist ?? null, [GovukValidators.required('Select yes or no')]],
        tradingName: [
          tradingDetails?.tradingName ?? null,
          [
            GovukValidators.required('Enter the trading name or other name'),
            GovukValidators.maxLength(255, 'The trading name or other name should not be more than 255 characters'),
          ],
        ],
      },
      { updateOn: 'change' },
    );
  },
};

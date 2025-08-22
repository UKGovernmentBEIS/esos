import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const overseasParentDetailsFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const overseasParentDetails = store.select(notificationQuery.selectResponsibleUndertaking)()?.overseasParentDetails;

    return fb.group(
      {
        name: [
          overseasParentDetails?.name ?? null,
          [
            GovukValidators.required('Enter the name of the parent company'),
            GovukValidators.maxLength(255, 'The name should not be more than 255 characters'),
          ],
        ],
        tradingName: [
          overseasParentDetails?.tradingName ?? null,
          [GovukValidators.maxLength(255, 'The trading name should not be more than 255 characters')],
        ],
      },
      { updateOn: 'change' },
    );
  },
};

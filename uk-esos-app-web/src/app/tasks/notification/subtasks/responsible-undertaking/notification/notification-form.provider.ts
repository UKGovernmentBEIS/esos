import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const notificationFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectResponsibleUndertaking);

    return fb.group({
      isBehalfOfTrust: [state()?.isBehalfOfTrust ?? null, [GovukValidators.required(`Select yes or no`)]],
      trustName: [
        {
          value: state()?.trustName ?? null,
          disabled: state()?.trustName === '',
        },
        GovukValidators.maxLength(255, 'The trust name should not be more than 255 characters'),
      ],
    });
  },
};

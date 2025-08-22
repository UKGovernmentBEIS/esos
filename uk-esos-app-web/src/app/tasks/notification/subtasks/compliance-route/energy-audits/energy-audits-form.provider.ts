import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const energyAuditsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const complianceRoute = store.select(notificationQuery.selectComplianceRoute)();

    return fb.group({
      energyAudits: [
        complianceRoute?.energyAudits ?? [],
        GovukValidators.required('You need to add at least one energy audit'),
      ],
    });
  },
};

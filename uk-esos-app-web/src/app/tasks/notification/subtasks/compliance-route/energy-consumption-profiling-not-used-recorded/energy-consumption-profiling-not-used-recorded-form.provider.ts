import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const energyConsumptionProfilingNotUsedRecordedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const isEnergyConsumptionProfilingNotUsedRecorded = store.select(notificationQuery.selectComplianceRoute)()
      ?.isEnergyConsumptionProfilingNotUsedRecorded;

    return fb.group({
      isEnergyConsumptionProfilingNotUsedRecorded: [
        isEnergyConsumptionProfilingNotUsedRecorded,
        GovukValidators.required('Select an option'),
      ],
    });
  },
};

import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { exclusiveCheckedValidator } from '../compliance-route.validators';

export const dataEstimatedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const estimatedCalculationTypes = store.select(notificationQuery.selectComplianceRoute)()
      ?.estimatedCalculationTypes;

    return fb.group({
      estimatedCalculationTypes: [
        estimatedCalculationTypes ?? null,
        [GovukValidators.required('Select an option'), exclusiveCheckedValidator()],
      ],
    });
  },
};

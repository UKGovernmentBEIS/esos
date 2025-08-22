import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { allCheckedValidator } from '../confirmation.validators';

export const ResponsibilityAssessmentTypesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const responsibilityAssessmentTypes = state()?.responsibilityAssessmentTypes;

    return fb.group({
      responsibilityAssessmentTypes: [responsibilityAssessmentTypes ?? null, allCheckedValidator(4)],
    });
  },
};

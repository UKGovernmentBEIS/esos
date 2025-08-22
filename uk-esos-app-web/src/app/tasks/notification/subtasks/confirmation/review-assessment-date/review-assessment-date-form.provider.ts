import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { dateAfterDecSixValidator } from '@tasks/notification/subtasks/confirmation/confirmation.validators';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const ReviewAssessmentDateFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const reviewAssessmentDate = state()?.reviewAssessmentDate;

    return fb.group({
      reviewAssessmentDate: [
        reviewAssessmentDate ? (new Date(reviewAssessmentDate) as any) : null,
        [GovukValidators.required('Select a date'), dateAfterDecSixValidator()],
      ],
    });
  },
};

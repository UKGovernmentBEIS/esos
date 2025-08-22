import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { allCheckedValidator } from '../confirmation.validators';

export const NoEnergyResponsibilityAssessmentTypesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectConfirmation);
    const noEnergyResponsibilityAssessmentTypes = state()?.noEnergyResponsibilityAssessmentTypes;

    return fb.group({
      noEnergyResponsibilityAssessmentTypes: [noEnergyResponsibilityAssessmentTypes ?? null, allCheckedValidator(4)],
    });
  },
};

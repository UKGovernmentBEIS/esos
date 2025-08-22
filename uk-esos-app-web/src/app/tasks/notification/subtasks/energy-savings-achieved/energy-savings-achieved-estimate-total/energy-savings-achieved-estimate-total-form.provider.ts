import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { mandatoryNumberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedEstimateTotalFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const totalEnergySavingsEstimation = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.totalEnergySavingsEstimation;

    return fb.group(
      {
        totalEnergySavingsEstimation: [totalEnergySavingsEstimation ?? null, mandatoryNumberValidators],
      },
      { updateOn: 'change' },
    );
  },
};

import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { mandatoryNumberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedEstimateFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsEstimation = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsEstimation;

    return fb.group(
      {
        buildings: [energySavingsEstimation?.buildings ?? null, mandatoryNumberValidators],
        transport: [energySavingsEstimation?.transport ?? null, mandatoryNumberValidators],
        industrialProcesses: [energySavingsEstimation?.industrialProcesses ?? null, mandatoryNumberValidators],
        otherProcesses: [energySavingsEstimation?.otherProcesses ?? null, mandatoryNumberValidators],
      },
      { updateOn: 'change' },
    );
  },
};

import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { optionalNumberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedCategoriesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsCategories = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsCategories;

    return fb.group(
      {
        energyManagementPractices: [
          energySavingsCategories?.energyManagementPractices ?? null,
          optionalNumberValidators,
        ],
        behaviourChangeInterventions: [
          energySavingsCategories?.behaviourChangeInterventions ?? null,
          optionalNumberValidators,
        ],
        training: [energySavingsCategories?.training ?? null, optionalNumberValidators],
        controlsImprovements: [energySavingsCategories?.controlsImprovements ?? null, optionalNumberValidators],
        capitalInvestments: [energySavingsCategories?.capitalInvestments ?? null, optionalNumberValidators],
        otherMeasures: [energySavingsCategories?.otherMeasures ?? null, optionalNumberValidators],
      },
      { updateOn: 'change' },
    );
  },
};

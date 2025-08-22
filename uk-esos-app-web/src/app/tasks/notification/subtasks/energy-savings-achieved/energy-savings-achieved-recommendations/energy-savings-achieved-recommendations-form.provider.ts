import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { numberValidators } from '../energy-savings-achieved.validators';

export const energySavingsAchievedRecommendationsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsRecommendations = store.select(notificationQuery.selectEnergySavingsAchieved)()
      ?.energySavingsRecommendations;

    return fb.group(
      {
        energyAudits: [
          energySavingsRecommendations?.energyAudits ?? null,
          [...numberValidators, GovukValidators.max(100, 'The integer should not be greater than 100')],
        ],
        alternativeComplianceRoutes: [
          energySavingsRecommendations?.alternativeComplianceRoutes ?? null,
          [...numberValidators, GovukValidators.max(100, 'The integer should not be greater than 100')],
        ],
        other: [
          energySavingsRecommendations?.other ?? null,
          [...numberValidators, GovukValidators.max(100, 'The integer should not be greater than 100')],
        ],
      },
      {
        updateOn: 'change',
      },
    );
  },
};

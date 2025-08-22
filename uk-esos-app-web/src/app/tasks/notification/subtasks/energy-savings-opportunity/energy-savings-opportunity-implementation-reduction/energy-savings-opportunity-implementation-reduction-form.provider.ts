import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { integerValidator, numberWithDecimalsValidators } from '../energy-savings-opportunity.validators';

export const energySavingsOpportunityImplementationReductionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectEnergySavingsOpportunities);
    const implementationEnergyConsumption = state()?.implementationEnergyConsumption;

    return fb.group({
      implementationEnergyConsumption: fb.group(
        {
          energyConsumption: [implementationEnergyConsumption?.energyConsumption, integerValidator],
          energyCost: [implementationEnergyConsumption?.energyCost, numberWithDecimalsValidators],
        },
        {
          updateOn: 'change',
        },
      ),
    });
  },
};

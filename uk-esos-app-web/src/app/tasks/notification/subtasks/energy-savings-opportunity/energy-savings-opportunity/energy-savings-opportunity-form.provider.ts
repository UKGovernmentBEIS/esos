import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { integerValidator, numberWithDecimalsValidators } from '../energy-savings-opportunity.validators';

export const energySavingsOpportunityFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energyConsumption = store.select(notificationQuery.selectEnergySavingsOpportunities)()?.energyConsumption;

    return fb.group(
      {
        buildings: fb.group(
          {
            energyConsumption: [energyConsumption?.buildings?.energyConsumption ?? null, integerValidator],
            energyCost: [energyConsumption?.buildings?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),

        transport: fb.group(
          {
            energyConsumption: [energyConsumption?.transport?.energyConsumption ?? null, integerValidator],
            energyCost: [energyConsumption?.transport?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),

        industrialProcesses: fb.group(
          {
            energyConsumption: [energyConsumption?.industrialProcesses?.energyConsumption ?? null, integerValidator],
            energyCost: [energyConsumption?.industrialProcesses?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),

        otherProcesses: fb.group(
          {
            energyConsumption: [energyConsumption?.otherProcesses?.energyConsumption ?? null, integerValidator],
            energyCost: [energyConsumption?.otherProcesses?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),
      },
      { updateOn: 'change' },
    );
  },
};

import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { integerValidator, numberWithDecimalsValidators } from '../energy-savings-opportunity.validators';

export const energySavingsOpportunityCategoryFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const energySavingsCategories = store.select(notificationQuery.selectEnergySavingsOpportunities)()
      ?.energySavingsCategories;

    return fb.group(
      {
        energyManagementPractices: fb.group(
          {
            energyConsumption: [
              energySavingsCategories?.energyManagementPractices?.energyConsumption ?? null,
              integerValidator,
            ],
            energyCost: [
              energySavingsCategories?.energyManagementPractices?.energyCost ?? null,
              numberWithDecimalsValidators,
            ],
          },
          { updateOn: 'change' },
        ),

        behaviourChangeInterventions: fb.group(
          {
            energyConsumption: [
              energySavingsCategories?.behaviourChangeInterventions?.energyConsumption ?? null,
              integerValidator,
            ],
            energyCost: [
              energySavingsCategories?.behaviourChangeInterventions?.energyCost ?? null,
              numberWithDecimalsValidators,
            ],
          },
          { updateOn: 'change' },
        ),

        training: fb.group(
          {
            energyConsumption: [energySavingsCategories?.training?.energyConsumption ?? null, integerValidator],
            energyCost: [energySavingsCategories?.training?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),

        controlsImprovements: fb.group(
          {
            energyConsumption: [
              energySavingsCategories?.controlsImprovements?.energyConsumption ?? null,
              integerValidator,
            ],
            energyCost: [
              energySavingsCategories?.controlsImprovements?.energyCost ?? null,
              numberWithDecimalsValidators,
            ],
          },
          { updateOn: 'change' },
        ),

        capitalInvestments: fb.group(
          {
            energyConsumption: [
              energySavingsCategories?.capitalInvestments?.energyConsumption ?? null,
              integerValidator,
            ],
            energyCost: [energySavingsCategories?.capitalInvestments?.energyCost ?? null, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),

        otherMeasures: fb.group(
          {
            energyConsumption: [energySavingsCategories?.otherMeasures?.energyConsumption, integerValidator],
            energyCost: [energySavingsCategories?.otherMeasures?.energyCost, numberWithDecimalsValidators],
          },
          { updateOn: 'change' },
        ),
      },
      { updateOn: 'change' },
    );
  },
};

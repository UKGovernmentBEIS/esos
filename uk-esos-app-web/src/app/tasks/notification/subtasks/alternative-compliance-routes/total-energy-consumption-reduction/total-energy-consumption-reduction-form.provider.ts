import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import {
  energyConsumptionIntegerOptionalValidators,
  energyCostNumberWithDecimalsOptionalValidators,
} from '../alternative-compliance-routes.validators';

export const totalEnergyConsumptionReductionFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const totalEnergyConsumptionReduction = state()?.totalEnergyConsumptionReduction;

    return fb.group({
      totalEnergyConsumptionReduction: fb.group({
        energyConsumption: [
          totalEnergyConsumptionReduction?.energyConsumption ?? null,
          energyConsumptionIntegerOptionalValidators,
        ],
        energyCost: [
          totalEnergyConsumptionReduction?.energyCost ?? null,
          energyCostNumberWithDecimalsOptionalValidators,
        ],
      }),
    });
  },
};

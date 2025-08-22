import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import {
  energyConsumptionIntegerOptionalValidators,
  energyCostNumberWithDecimalsOptionalValidators,
  reductionPairValidator,
} from '../alternative-compliance-routes.validators';

export const energyConsumptionReductionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const energyConsumptionReduction = state()?.energyConsumptionReduction;

    return fb.group({
      buildings: fb.group(
        {
          energyConsumption: [
            energyConsumptionReduction?.buildings?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReduction?.buildings?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      transport: fb.group(
        {
          energyConsumption: [
            energyConsumptionReduction?.transport?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReduction?.transport?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      industrialProcesses: fb.group(
        {
          energyConsumption: [
            energyConsumptionReduction?.industrialProcesses?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReduction?.industrialProcesses?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      otherProcesses: fb.group(
        {
          energyConsumption: [
            energyConsumptionReduction?.otherProcesses?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReduction?.otherProcesses?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
    });
  },
};

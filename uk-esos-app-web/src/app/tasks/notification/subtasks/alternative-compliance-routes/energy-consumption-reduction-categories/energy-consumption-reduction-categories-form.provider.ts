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

export const energyConsumptionReductionCategoriesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const state = store.select(notificationQuery.selectAlternativeComplianceRoutes);
    const energyConsumptionReductionCategories = state()?.energyConsumptionReductionCategories;

    return fb.group({
      energyManagementPractices: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.energyManagementPractices?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.energyManagementPractices?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      behaviourChangeInterventions: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.behaviourChangeInterventions?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.behaviourChangeInterventions?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      training: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.training?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.training?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      controlsImprovements: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.controlsImprovements?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.controlsImprovements?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      capitalInvestments: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.capitalInvestments?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.capitalInvestments?.energyCost ?? null,
            energyCostNumberWithDecimalsOptionalValidators,
          ],
        },
        {
          updateOn: 'change',
          validators: [reductionPairValidator()],
        },
      ),
      otherMeasures: fb.group(
        {
          energyConsumption: [
            energyConsumptionReductionCategories?.otherMeasures?.energyConsumption ?? null,
            energyConsumptionIntegerOptionalValidators,
          ],
          energyCost: [
            energyConsumptionReductionCategories?.otherMeasures?.energyCost ?? null,
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

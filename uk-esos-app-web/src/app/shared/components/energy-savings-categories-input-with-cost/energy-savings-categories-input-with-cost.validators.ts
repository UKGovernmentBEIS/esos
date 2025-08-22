import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

/**
 * Validates that the total of `energySavingsEstimation` is equal to the total of `energySavingsCategories`
 */
export const energySavingsTotalsWithCostEqualValidator = (estimatesTotalKWh: number): ValidatorFn => {
  return GovukValidators.builder(
    'The total annual reduction by energy saving category must be equal to the total annual reduction in energy consumption by organisational purpose',
    (group: UntypedFormGroup) => {
      const energyManagementPractices = group.controls.energyManagementPractices;
      const behaviourChangeInterventions = group.controls.behaviourChangeInterventions;
      const training = group.controls.training;
      const controlsImprovements = group.controls.controlsImprovements;
      const capitalInvestments = group.controls.capitalInvestments;
      const otherMeasures = group.controls.otherMeasures;

      const total =
        +energyManagementPractices.value.energyConsumption +
        +behaviourChangeInterventions.value.energyConsumption +
        +training.value.energyConsumption +
        +controlsImprovements.value.energyConsumption +
        +capitalInvestments.value.energyConsumption +
        +otherMeasures.value.energyConsumption;

      return total === estimatesTotalKWh ? null : { energySavingsTotalsNotEqual: true };
    },
  );
};

import { isInputBigNumberEmpty } from '@shared/utils/bignumber.utils';
import { isInputNumberEmpty } from '@shared/utils/number.utils';
import BigNumber from 'bignumber.js';

import { EnergySavingsCategoriesPotentialReduction } from 'esos-api';

export function getTotalReductionCategories(
  energySavingsCategories: EnergySavingsCategoriesPotentialReduction,
): number {
  return (
    +energySavingsCategories.energyManagementPractices.energyConsumption +
    +energySavingsCategories.behaviourChangeInterventions.energyConsumption +
    +energySavingsCategories.training.energyConsumption +
    +energySavingsCategories.controlsImprovements.energyConsumption +
    +energySavingsCategories.capitalInvestments.energyConsumption +
    +energySavingsCategories.otherMeasures.energyConsumption
  );
}

export function getTotalReductionCategoriesOptional(
  energySavingsCategories: EnergySavingsCategoriesPotentialReduction,
) {
  if (
    isInputNumberEmpty(energySavingsCategories.energyManagementPractices.energyConsumption) &&
    isInputNumberEmpty(energySavingsCategories.behaviourChangeInterventions.energyConsumption) &&
    isInputNumberEmpty(energySavingsCategories.training.energyConsumption) &&
    isInputNumberEmpty(energySavingsCategories.controlsImprovements.energyConsumption) &&
    isInputNumberEmpty(energySavingsCategories.capitalInvestments.energyConsumption) &&
    isInputNumberEmpty(energySavingsCategories.otherMeasures.energyConsumption)
  ) {
    return null;
  }

  return getTotalReductionCategories(energySavingsCategories);
}

export function getTotalReductionCategoriesCost(
  energySavingsCategories: EnergySavingsCategoriesPotentialReduction,
): number {
  const costs = [
    energySavingsCategories.energyManagementPractices?.energyCost,
    energySavingsCategories.behaviourChangeInterventions?.energyCost,
    energySavingsCategories.training?.energyCost,
    energySavingsCategories.controlsImprovements?.energyCost,
    energySavingsCategories.capitalInvestments?.energyCost,
    energySavingsCategories.otherMeasures?.energyCost,
  ];

  return costs.reduce((accumulator, current) => accumulator.plus(new BigNumber(+current)), new BigNumber(0)).toNumber();
}

export function getTotalReductionCategoriesCostOptional(
  energySavingsCategories: EnergySavingsCategoriesPotentialReduction,
) {
  if (
    isInputBigNumberEmpty(energySavingsCategories.energyManagementPractices.energyCost) &&
    isInputBigNumberEmpty(energySavingsCategories.behaviourChangeInterventions.energyCost) &&
    isInputBigNumberEmpty(energySavingsCategories.training.energyCost) &&
    isInputBigNumberEmpty(energySavingsCategories.controlsImprovements.energyCost) &&
    isInputBigNumberEmpty(energySavingsCategories.capitalInvestments.energyCost) &&
    isInputBigNumberEmpty(energySavingsCategories.otherMeasures.energyCost)
  ) {
    return null;
  }

  return getTotalReductionCategoriesCost(energySavingsCategories);
}

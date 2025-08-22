import { EnergySavingsCategories } from 'esos-api';

export function getEnergySavingsCategoriesTotalSum(energySavingsCategories: EnergySavingsCategories): number {
  if (
    energySavingsCategories.energyManagementPractices == null &&
    energySavingsCategories.behaviourChangeInterventions == null &&
    energySavingsCategories.training == null &&
    energySavingsCategories.controlsImprovements == null &&
    energySavingsCategories.capitalInvestments == null &&
    energySavingsCategories.otherMeasures == null
  ) {
    return null;
  }

  return (
    +energySavingsCategories.energyManagementPractices +
    +energySavingsCategories.behaviourChangeInterventions +
    +energySavingsCategories.training +
    +energySavingsCategories.controlsImprovements +
    +energySavingsCategories.capitalInvestments +
    +energySavingsCategories.otherMeasures
  );
}

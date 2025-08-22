export const SUB_TASK_FIRST_COMPLIANCE_PERIOD = 'firstCompliancePeriod';
export const SUB_TASK_SECOND_COMPLIANCE_PERIOD = 'secondCompliancePeriod';

export enum CurrentStep {
  SUMMARY = '',
  INFORMATION_EXISTS = 'informationExists',
  ORGANISATIONAL_ENERGY_CONSUMPTION = 'totalEnergyConsumptionBreakdown',
  ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN = 'organisationalEnergyConsumption',
  SIGNIFICANT_ENERGY_CONSUMPTION = 'significantEnergyConsumption',
  EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION = 'hasExplanationOfChangesToTotalEnergyConsumption',
  POTENTIAL_REDUCTION = 'potentialReduction',
  REDUCTION_ACHIEVED = 'reductionAchieved',
}

export enum WizardStep {
  SUMMARY = '',
  INFORMATION_EXISTS = 'information-exists',
  ORGANISATIONAL_ENERGY_CONSUMPTION = 'organisational-energy-consumption',
  ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN = 'organisational-energy-consumption-breakdown',
  SIGNIFICANT_ENERGY_CONSUMPTION = 'significant-energy-consumption',
  EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION = 'explanation-of-changes-to-total-energy-consumption',
  POTENTIAL_REDUCTION = 'potential-reduction',
  REDUCTION_ACHIEVED = 'reduction-achieved',
}

export const getCompliancePeriodHint = (isFirstCompliancePeriod: boolean) => {
  return isFirstCompliancePeriod
    ? 'The first compliance period lasted from 17 July 2014 to 5 December 2015.'
    : 'The second compliance period lasted from 6 December 2015 to 5 December 2019.';
};

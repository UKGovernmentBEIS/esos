import { EnergySavingsRecommendations } from 'esos-api';

export const ENERGY_SAVINGS_ACHIEVED_SUB_TASK = 'energySavingsAchieved';

export enum EnergySavingsAchievedCurrentStep {
  ESTIMATE = 'estimate',
  ESTIMATE_TOTAL = 'estimate-total',
  CATEGORIES_EXIST = 'categories-exist',
  CATEGORIES = 'categories',
  RECOMMENDATIONS_EXIST = 'recomendations-exist',
  RECOMMENDATIONS = 'recomendations',
  DETAILS = 'details',
  SUMMARY = 'summary',
}

export enum EnergySavingsAchievedWizardStep {
  STEP_ESTIMATE = 'estimate',
  STEP_ESTIMATE_TOTAL = 'estimate-total',
  STEP_CATEGORIES_EXIST = 'categories-exist',
  STEP_CATEGORIES = 'categories',
  STEP_RECOMMENDATIONS_EXIST = 'recomendations-exist',
  STEP_RECOMMENDATIONS = 'recomendations',
  STEP_DETAILS = 'details',
  SUMMARY = '../',
}

export function getTotalPercentageSum(energySavingsRecommendations: EnergySavingsRecommendations): number {
  if (
    energySavingsRecommendations.alternativeComplianceRoutes == null &&
    energySavingsRecommendations.energyAudits == null &&
    energySavingsRecommendations.other == null
  ) {
    return null;
  }

  return (
    +energySavingsRecommendations.alternativeComplianceRoutes +
    +energySavingsRecommendations.energyAudits +
    +energySavingsRecommendations.other
  );
}

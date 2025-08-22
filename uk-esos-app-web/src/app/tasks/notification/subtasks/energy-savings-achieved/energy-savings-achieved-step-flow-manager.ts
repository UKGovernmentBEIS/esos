import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import {
  ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
  EnergySavingsAchievedCurrentStep,
  EnergySavingsAchievedWizardStep,
} from './energy-savings-achieved.helper';

export class EnergySavingsAchievedStepFlowManager extends StepFlowManager {
  override subtask = ENERGY_SAVINGS_ACHIEVED_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const energySavingsAchieved = this.store.select(notificationQuery.selectEnergySavingsAchieved)();

    switch (currentStep) {
      case EnergySavingsAchievedCurrentStep.ESTIMATE:
        return `../${EnergySavingsAchievedWizardStep.STEP_CATEGORIES_EXIST}`;

      case EnergySavingsAchievedCurrentStep.ESTIMATE_TOTAL:
        return `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST}`;

      case EnergySavingsAchievedCurrentStep.CATEGORIES_EXIST:
        return energySavingsAchieved.energySavingCategoriesExist === 'YES'
          ? `../${EnergySavingsAchievedWizardStep.STEP_CATEGORIES}`
          : `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST}`;

      case EnergySavingsAchievedCurrentStep.CATEGORIES:
        return `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST}`;

      case EnergySavingsAchievedCurrentStep.RECOMMENDATIONS_EXIST:
        return energySavingsAchieved.energySavingsRecommendationsExist === 'YES'
          ? `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS}`
          : `../${EnergySavingsAchievedWizardStep.STEP_DETAILS}`;

      case EnergySavingsAchievedCurrentStep.RECOMMENDATIONS:
        return `../${EnergySavingsAchievedWizardStep.STEP_DETAILS}`;

      case EnergySavingsAchievedCurrentStep.DETAILS:
        return EnergySavingsAchievedWizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}

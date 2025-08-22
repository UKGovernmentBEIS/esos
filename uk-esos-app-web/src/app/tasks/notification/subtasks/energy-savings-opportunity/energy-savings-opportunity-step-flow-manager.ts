import { StepFlowManager } from '@common/forms/step-flow';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
  EnergySavingsOpportunitiesWizardStep,
} from './energy-savings-opportunity.helper';

export class EnergySavingsOpportunityStepFlowManager extends StepFlowManager {
  override subtask = ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case EnergySavingsOpportunitiesCurrentStep.STEP1:
        return `../${EnergySavingsOpportunitiesWizardStep.STEP2}`;

      case EnergySavingsOpportunitiesCurrentStep.STEP2:
        return `../${EnergySavingsOpportunitiesWizardStep.STEP3}`;

      case EnergySavingsOpportunitiesCurrentStep.STEP3:
        return EnergySavingsOpportunitiesWizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}

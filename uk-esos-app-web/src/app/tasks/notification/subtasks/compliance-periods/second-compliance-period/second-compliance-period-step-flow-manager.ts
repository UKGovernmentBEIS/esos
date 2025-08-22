import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  CurrentStep,
  SUB_TASK_SECOND_COMPLIANCE_PERIOD,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export class SecondCompliancePeriodStepFlowManager extends StepFlowManager {
  override subtask = SUB_TASK_SECOND_COMPLIANCE_PERIOD;

  override resolveNextStepRoute(currentStep: string): string {
    const secondCompliancePeriod = this.store.select(notificationQuery.selectSecondCompliancePeriod)();

    switch (currentStep) {
      case CurrentStep.INFORMATION_EXISTS:
        return secondCompliancePeriod.informationExists === 'YES'
          ? `../${WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION}`
          : `../${WizardStep.SUMMARY}`;

      case CurrentStep.ORGANISATIONAL_ENERGY_CONSUMPTION:
        return `../${WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN}`;

      case CurrentStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN:
        return `../${WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION}`;

      case CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION:
        return `../${WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION}`;

      case CurrentStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION:
        return `../${WizardStep.POTENTIAL_REDUCTION}`;

      case CurrentStep.POTENTIAL_REDUCTION:
        return `../${WizardStep.REDUCTION_ACHIEVED}`;

      case CurrentStep.REDUCTION_ACHIEVED:
        return `../${WizardStep.SUMMARY}`;

      case CurrentStep.SUMMARY:
        return `../../`;
    }
  }
}

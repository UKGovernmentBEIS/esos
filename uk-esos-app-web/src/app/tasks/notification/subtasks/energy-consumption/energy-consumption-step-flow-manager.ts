import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
  EnergyConsumptionWizardStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';

export class EnergyConsumptionStepFlowManager extends StepFlowManager {
  override subtask = ENERGY_CONSUMPTION_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const energyConsumption = this.store.select(notificationQuery.selectEnergyConsumption)();

    switch (currentStep) {
      case EnergyConsumptionCurrentStep.TOTAL_ENERGY:
        return '../' + EnergyConsumptionWizardStep.USE_SIGNIFICANT_ENERGY;

      case EnergyConsumptionCurrentStep.USE_SIGNIFICANT_ENERGY:
        return energyConsumption.significantEnergyConsumptionExists
          ? '../' + EnergyConsumptionWizardStep.SIGNIFICANT_ENERGY
          : '../' + EnergyConsumptionWizardStep.ENERGY_INTENSITY_RATIO;

      case EnergyConsumptionCurrentStep.SIGNIFICANT_ENERGY:
        return '../' + EnergyConsumptionWizardStep.ENERGY_INTENSITY_RATIO;

      case EnergyConsumptionCurrentStep.ENERGY_INTENSITY_RATIO:
        return '../' + EnergyConsumptionWizardStep.ADDITIONAL_INFO;

      case EnergyConsumptionCurrentStep.ADDITIONAL_INFO:
        return EnergyConsumptionWizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}

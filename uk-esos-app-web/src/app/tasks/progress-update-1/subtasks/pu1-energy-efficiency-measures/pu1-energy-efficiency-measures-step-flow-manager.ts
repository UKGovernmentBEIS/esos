import { StepFlowManager } from '@common/forms/step-flow';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  ProgressUpdate1EnergyEfficiencyMeasuresStepUrl,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from './pu1-energy-efficiency-measures.helper';

export class ProgressUpdate1EnergyEfficiencyMeasuresStepFlowManager extends StepFlowManager {
  subtask = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ProgressUpdate1EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE:
        return `../${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY}`;

      case ProgressUpdate1EnergyEfficiencyMeasuresStep.ADD_NEW_MEASURE:
        return ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY;

      case ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_NEW_MEASURE:
      case ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_UPDATE_FOR_MEASURE:
      case ProgressUpdate1EnergyEfficiencyMeasuresStep.REMOVE_NEW_MEASURE:
        return `../${ProgressUpdate1EnergyEfficiencyMeasuresStepUrl.SUMMARY}`;

      case ProgressUpdate1EnergyEfficiencyMeasuresStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }
}

import { StepFlowManager } from '@common/forms/step-flow';

import {
  ProgressUpdate2EnergyEfficiencyMeasuresStep,
  ProgressUpdate2EnergyEfficiencyMeasuresStepUrl,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from './pu2-energy-efficiency-measures.helper';

export class ProgressUpdate2EnergyEfficiencyMeasuresStepFlowManager extends StepFlowManager {
  subtask = PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ProgressUpdate2EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE:
        return `../${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY}`;

      case ProgressUpdate2EnergyEfficiencyMeasuresStep.ADD_NEW_MEASURE:
        return ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY;

      case ProgressUpdate2EnergyEfficiencyMeasuresStep.EDIT_NEW_MEASURE:
      case ProgressUpdate2EnergyEfficiencyMeasuresStep.EDIT_UPDATE_FOR_MEASURE:
      case ProgressUpdate2EnergyEfficiencyMeasuresStep.REMOVE_NEW_MEASURE:
        return `../${ProgressUpdate2EnergyEfficiencyMeasuresStepUrl.SUMMARY}`;

      case ProgressUpdate2EnergyEfficiencyMeasuresStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }
}

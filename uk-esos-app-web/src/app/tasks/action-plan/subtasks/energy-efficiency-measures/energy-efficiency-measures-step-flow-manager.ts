import { StepFlowManager } from '@common/forms/step-flow';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  EnergyEfficiencyMeasuresStep,
  EnergyEfficiencyMeasuresStepUrl,
} from './energy-efficiency-measures.helper';

export class EnergyEfficiencyMeasuresStepFlowManager extends StepFlowManager {
  subtask = ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case EnergyEfficiencyMeasuresStep.PROPOSED_MEASURES:
        return this.haveEnergyEfficiencyMeasures
          ? `../${EnergyEfficiencyMeasuresStepUrl.MEASURE_FORM}`
          : EnergyEfficiencyMeasuresStepUrl.SUMMARY;

      case EnergyEfficiencyMeasuresStep.MEASURE_FORM:
        return EnergyEfficiencyMeasuresStepUrl.SUMMARY;

      case EnergyEfficiencyMeasuresStep.ADD_ANOTHER_MEASURE:
        return EnergyEfficiencyMeasuresStepUrl.SUMMARY;

      case EnergyEfficiencyMeasuresStep.EDIT_MEASURE:
        return `../${EnergyEfficiencyMeasuresStepUrl.SUMMARY}`;

      case EnergyEfficiencyMeasuresStep.REMOVE_MEASURE:
        return this.hasAddedMeasures
          ? `../${EnergyEfficiencyMeasuresStepUrl.SUMMARY}`
          : `../../${EnergyEfficiencyMeasuresStepUrl.MEASURE_FORM}`;

      case EnergyEfficiencyMeasuresStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }

  private get haveEnergyEfficiencyMeasures(): boolean {
    return this.store.select(actionPlanQuery.selectHaveEnergyEfficiencyMeasures)();
  }

  private get hasAddedMeasures(): boolean {
    return !!this.store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)()?.length;
  }
}

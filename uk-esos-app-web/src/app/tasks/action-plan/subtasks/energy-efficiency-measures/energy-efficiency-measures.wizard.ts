import { ActionPlanEnergyEfficiencyMeasure } from 'esos-api';

export const isWizardCompleted = (energyEfficiencyMeasure?: ActionPlanEnergyEfficiencyMeasure) => {
  const { haveEnergyEfficiencyMeasures, energyEfficiencyMeasures } = energyEfficiencyMeasure ?? {};

  const isHaveEnergyEfficiencyMeasuresCompleted =
    haveEnergyEfficiencyMeasures !== null && haveEnergyEfficiencyMeasures !== undefined;

  if (isHaveEnergyEfficiencyMeasuresCompleted && haveEnergyEfficiencyMeasures === false) {
    return true;
  }

  const isEnergyEfficiencyMeasuresCompleted = !!energyEfficiencyMeasures?.length;

  return isHaveEnergyEfficiencyMeasuresCompleted && isEnergyEfficiencyMeasuresCompleted;
};

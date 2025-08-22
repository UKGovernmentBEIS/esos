import { getSignificantPercentage } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { isEnergyIntensityRatioValid } from '@shared/components/energy-intensity-ratio-input/energy-intensity-ratio-input';

import { ComplianceRouteDistribution, EnergyConsumptionDetails } from 'esos-api';

export const isWizardCompleted = (
  energyConsumption: EnergyConsumptionDetails,
  complianceRouteDistribution: ComplianceRouteDistribution,
) => {
  const percentage = getSignificantPercentage(
    energyConsumption?.totalEnergyConsumption?.total ?? 0,
    energyConsumption?.significantEnergyConsumption?.total ?? 0,
  );

  const isEnergyNotAuditedPctValid =
    (complianceRouteDistribution.energyNotAuditedPct > 0 &&
      energyConsumption?.significantEnergyConsumptionExists === true) ||
    (complianceRouteDistribution.energyNotAuditedPct === 0 &&
      energyConsumption?.significantEnergyConsumptionExists != null);

  return (
    !!energyConsumption &&
    !!energyConsumption.totalEnergyConsumption &&
    isEnergyNotAuditedPctValid &&
    ((energyConsumption.significantEnergyConsumptionExists &&
      !!energyConsumption.significantEnergyConsumption &&
      percentage >= 95 &&
      percentage <= 100) ||
      (!energyConsumption.significantEnergyConsumptionExists && !energyConsumption.significantEnergyConsumption)) &&
    isEnergyIntensityRatioValid(energyConsumption) &&
    energyConsumption.additionalInformationExists != null
  );
};

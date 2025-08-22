import { pick } from 'lodash-es';

import { EnergyConsumptionDetails, OrganisationalEnergyIntensityRatioData } from 'esos-api';

export const organisationRatioDataKeys: Record<keyof OrganisationalEnergyIntensityRatioData, string> = {
  buildings: 'buildings',
  transport: 'transport',
  industrialProcesses: 'industrialProcesses',
  otherProcesses: 'otherProcesses',
};

export function isEnergyIntensityRatioValid(energyConsumption: EnergyConsumptionDetails) {
  const consumption = energyConsumption?.significantEnergyConsumptionExists
    ? energyConsumption?.significantEnergyConsumption
    : energyConsumption?.totalEnergyConsumption;

  if (energyConsumption.energyIntensityRatioData) {
    const validKeys = pick(consumption, Object.keys(organisationRatioDataKeys));
    const ratioKeys = Object.keys(energyConsumption.energyIntensityRatioData);
    const validEntries = Object.entries(validKeys).filter((e) => e[1] !== 0);

    return validEntries.length === ratioKeys.length;
  }

  return false;
}

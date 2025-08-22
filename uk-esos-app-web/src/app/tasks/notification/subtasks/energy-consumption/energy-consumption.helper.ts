import { EnergyConsumption, EnergyConsumptionDetails, SignificantEnergyConsumption } from 'esos-api';

export const ENERGY_CONSUMPTION_SUB_TASK = 'energyConsumptionDetails';

export enum EnergyConsumptionCurrentStep {
  TOTAL_ENERGY = 'totalEnergy',
  USE_SIGNIFICANT_ENERGY = 'useSignificantEnergy',
  SIGNIFICANT_ENERGY = 'significantEnergy',
  ENERGY_INTENSITY_RATIO = 'energyIntensityRatio',
  ADDITIONAL_INFO = 'additionalInfo',
  SUMMARY = 'summary',
}

export enum EnergyConsumptionWizardStep {
  TOTAL_ENERGY = 'total-energy',
  USE_SIGNIFICANT_ENERGY = 'use-significant-energy',
  SIGNIFICANT_ENERGY = 'significant-energy',
  ENERGY_INTENSITY_RATIO = 'energy-intensity-ratio',
  ADDITIONAL_INFO = 'additional-info',
  SUMMARY = '../',
}

export function getSignificantOrTotalEnergyConsumption(
  energyConsumptionDetails: EnergyConsumptionDetails,
): SignificantEnergyConsumption | EnergyConsumption {
  const significantEnergyConsumptionExists = energyConsumptionDetails.significantEnergyConsumptionExists;

  const energyConsumption = significantEnergyConsumptionExists
    ? energyConsumptionDetails.significantEnergyConsumption
    : energyConsumptionDetails.totalEnergyConsumption;

  return energyConsumption;
}

export function getEnergyConsumptionHeading(significantEnergyConsumptionExists: boolean): string {
  return significantEnergyConsumptionExists ? 'significant energy consumption' : 'total energy consumption';
}

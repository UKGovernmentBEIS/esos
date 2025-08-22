import { EnergyConsumption } from 'esos-api';

export function getEnergyConsumptionTotalSum(energyConsumption: EnergyConsumption): number {
  return (
    +energyConsumption.buildings +
    +energyConsumption.transport +
    +energyConsumption.industrialProcesses +
    +energyConsumption.otherProcesses
  );
}

export function getEnergyConsumptionTotalSumOrNull(energyConsumption: EnergyConsumption): number {
  if (
    (energyConsumption.buildings == null || (energyConsumption.buildings as any) === '') &&
    (energyConsumption.transport == null || (energyConsumption.transport as any) === '') &&
    (energyConsumption.industrialProcesses == null || (energyConsumption.industrialProcesses as any) === '') &&
    (energyConsumption.otherProcesses == null || (energyConsumption.otherProcesses as any) === '')
  )
    return null;
  return (
    +energyConsumption.buildings +
    +energyConsumption.transport +
    +energyConsumption.industrialProcesses +
    +energyConsumption.otherProcesses
  );
}

export function getSignificantPercentage(
  totalEnergyConsumption: number,
  significantTotalEnergyConsumption: number,
): number {
  return totalEnergyConsumption > 0
    ? Math.floor((significantTotalEnergyConsumption / totalEnergyConsumption) * 100)
    : 0;
}

export function getSignificantPercentageOrNull(
  totalEnergyConsumption: number,
  significantTotalEnergyConsumption: number,
): number {
  if (totalEnergyConsumption == null || significantTotalEnergyConsumption == null) {
    return null;
  }

  return totalEnergyConsumption > 0
    ? Math.floor((significantTotalEnergyConsumption / totalEnergyConsumption) * 100)
    : 0;
}

import { isInputBigNumberEmpty } from '@shared/utils/bignumber.utils';
import { isInputNumberEmpty } from '@shared/utils/number.utils';
import BigNumber from 'bignumber.js';

import { EnergyConsumptionPotentialReduction } from 'esos-api';

export function getTotalConsumptionPotential(energyConsumption: EnergyConsumptionPotentialReduction): number {
  return (
    +energyConsumption.buildings?.energyConsumption +
    +energyConsumption.transport?.energyConsumption +
    +energyConsumption.industrialProcesses?.energyConsumption +
    +energyConsumption.otherProcesses?.energyConsumption
  );
}

export function getTotalConsumptionPotentialOptional(energyConsumption: EnergyConsumptionPotentialReduction): number {
  if (
    isInputNumberEmpty(energyConsumption.buildings.energyConsumption) &&
    isInputNumberEmpty(energyConsumption.transport.energyConsumption) &&
    isInputNumberEmpty(energyConsumption.industrialProcesses.energyConsumption) &&
    isInputNumberEmpty(energyConsumption.otherProcesses.energyConsumption)
  ) {
    return null;
  }
  return getTotalConsumptionPotential(energyConsumption);
}

export function getTotalConsumptionPotentialCost(energyConsumption: EnergyConsumptionPotentialReduction): number {
  const costs = [
    energyConsumption.buildings?.energyCost,
    energyConsumption.transport?.energyCost,
    energyConsumption.industrialProcesses?.energyCost,
    energyConsumption.otherProcesses?.energyCost,
  ];

  return costs.reduce((accumulator, current) => accumulator.plus(new BigNumber(+current)), new BigNumber(0)).toNumber();
}

export function getTotalConsumptionPotentialCostOptional(energyConsumption: EnergyConsumptionPotentialReduction) {
  if (
    isInputBigNumberEmpty(energyConsumption.buildings?.energyCost) &&
    isInputBigNumberEmpty(energyConsumption.transport?.energyCost) &&
    isInputBigNumberEmpty(energyConsumption.industrialProcesses?.energyCost) &&
    isInputBigNumberEmpty(energyConsumption.otherProcesses?.energyCost)
  ) {
    return null;
  }
  return getTotalConsumptionPotentialCost(energyConsumption);
}

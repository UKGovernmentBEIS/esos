import { EnergySavingsOpportunities } from 'esos-api';

export const isWizardCompleted = (energySavingsOpportunities: EnergySavingsOpportunities) => {

  return !!energySavingsOpportunities?.implementationEnergyConsumption && 
    !!energySavingsOpportunities?.energyConsumption && 
    !!energySavingsOpportunities?.energySavingsCategories;
};

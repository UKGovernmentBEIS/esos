import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export const WIZARD_STEP_HEADINGS: Record<WizardStep, (isFirstCompliancePeriod: boolean) => string> = {
  [WizardStep.INFORMATION_EXISTS]: (isFirstCompliancePeriod: boolean) =>
    `Do you want to provide historical information about compliance with the scheme during the ${
      isFirstCompliancePeriod ? 'first compliance period?' : 'second compliance period?'
    }`,
  [WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `What was the organisational energy consumption in kWh for the ${
      isFirstCompliancePeriod ? 'first period?' : 'second period?'
    } (optional)`,
  [WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN]: (isFirstCompliancePeriod: boolean) =>
    isFirstCompliancePeriod
      ? 'What was the organisational energy consumption in kWh for the first period? (optional)'
      : 'What was the breakdown of the organisational energy consumption in kWh for the second period? (optional)',
  [WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `What was the significant energy consumption during the ${
      isFirstCompliancePeriod ? 'first compliance period' : 'second compliance period'
    }? (optional)`,
  [WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION]: (isFirstCompliancePeriod: boolean) =>
    `Explain any changes to total energy consumption between ${
      isFirstCompliancePeriod ? 'the first and second' : 'the second and third'
    } compliance periods (optional)`,
  [WizardStep.POTENTIAL_REDUCTION]: (isFirstCompliancePeriod: boolean) =>
    `How much energy could your organisation have saved annually if measures suggested by your energy audit for the 
    ${isFirstCompliancePeriod ? 'first period' : 'second period'} were
    implemented? (optional)`,
  [WizardStep.REDUCTION_ACHIEVED]: () =>
    `How much energy did your organisation save during the second compliance period? (optional)`,
  [WizardStep.SUMMARY]: () => ``,
};

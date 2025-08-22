import { SecondCompliancePeriod } from 'esos-api';

export const isWizardCompleted = (compliancePeriod: SecondCompliancePeriod) => {
  return compliancePeriod?.informationExists != null;
};

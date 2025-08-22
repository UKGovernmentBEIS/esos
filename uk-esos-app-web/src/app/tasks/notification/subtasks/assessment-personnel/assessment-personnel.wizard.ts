import { AssessmentPersonnel } from 'esos-api';

export const isWizardCompleted = (assessmentPersonnel: AssessmentPersonnel) => {
  return assessmentPersonnel != null;
};

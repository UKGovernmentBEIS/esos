import { StepFlowManager } from '@common/forms/step-flow';

import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  ResponsibleOfficerConfirmationStep,
  ResponsibleOfficerConfirmationStepUrl,
} from './responsible-officer-confirmation.helper';

export class ResponsibleOfficerConfirmationStepFlowManager extends StepFlowManager {
  subtask = RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ResponsibleOfficerConfirmationStep.REVIEW:
        return ResponsibleOfficerConfirmationStepUrl.SUMMARY;

      case ResponsibleOfficerConfirmationStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }
}

import { StepFlowManager } from '@common/forms/step-flow';

import {
  ProgressUpdateResponsibleOfficerConfirmationStep,
  ProgressUpdateResponsibleOfficerConfirmationStepUrl,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
} from './pu-responsible-officer-confirmation.helper';

export class ProgressUpdateResponsibleOfficerConfirmationStepFlowManager extends StepFlowManager {
  subtask = PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ProgressUpdateResponsibleOfficerConfirmationStep.REVIEW:
        return ProgressUpdateResponsibleOfficerConfirmationStepUrl.SUMMARY;

      case ProgressUpdateResponsibleOfficerConfirmationStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }
}

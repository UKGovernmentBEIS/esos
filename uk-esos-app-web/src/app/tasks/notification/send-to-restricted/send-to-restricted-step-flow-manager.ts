import { StepFlowManager } from '@common/forms/step-flow';

export class SendToRestrictedStepFlowManager extends StepFlowManager {
  subtask = 'sendToRestricted';

  override resolveNextStepRoute(currentStep: string): string {
    if (currentStep === 'action') {
      return './success';
    } else {
      return '';
    }
  }
}

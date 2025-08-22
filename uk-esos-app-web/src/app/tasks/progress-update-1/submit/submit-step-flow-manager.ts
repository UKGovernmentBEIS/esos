import { StepFlowManager } from '@common/forms/step-flow';

export class ProgressUpdate1SubmitStepFlowManager extends StepFlowManager {
  subtask = 'submit';

  override resolveNextStepRoute(currentStep: string): string {
    if (currentStep === 'action') {
      return './confirmation';
    }
  }
}

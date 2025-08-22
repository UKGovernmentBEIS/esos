import { StepFlowManager } from '@common/forms/step-flow';

import {
  ProgressUpdateGroupChangeStep,
  ProgressUpdateGroupChangeStepUrl,
  PU_GROUP_CHANGE_SUBTASK_NAME,
} from './pu-group-change.helper';

export class ProgressUpdateGroupChangeStepFlowManager extends StepFlowManager {
  subtask = PU_GROUP_CHANGE_SUBTASK_NAME;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ProgressUpdateGroupChangeStep.FORM:
        return ProgressUpdateGroupChangeStepUrl.SUMMARY;

      case ProgressUpdateGroupChangeStep.SUMMARY:
        return '../..';

      default:
        return '../../..';
    }
  }
}

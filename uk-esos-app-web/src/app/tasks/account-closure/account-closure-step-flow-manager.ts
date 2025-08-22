import { Injectable } from '@angular/core';

import { StepFlowManager } from '@common/forms/step-flow';

export enum AccountClosureStep {
  FORM = 'form',
  SUBMIT = 'submit',
  CONFIRMATION = 'confirmation',
}

export enum AccountClosureStepUrl {
  FORM = '../',
  SUBMIT = 'submit',
  CONFIRMATION = 'confirmation',
}

export const ACCOUNT_CLOSURE_TASK_PATH = 'account-closure';

@Injectable({ providedIn: 'root' })
export class AccountClosureStepFlowManager extends StepFlowManager {
  subtask = 'accountClosure';

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case AccountClosureStep.FORM:
        return `${ACCOUNT_CLOSURE_TASK_PATH}/${AccountClosureStepUrl.SUBMIT}`;

      case AccountClosureStep.SUBMIT:
        return `../${AccountClosureStepUrl.CONFIRMATION}`;

      default:
        return '../..';
    }
  }
}

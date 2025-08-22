import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
  ResponsibleUndertakingWizardStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';

import { NocP3 } from 'esos-api';

export class ResponsibleUndertakingStepFlowManager extends StepFlowManager {
  override subtask: keyof NocP3 = RESPONSIBLE_UNDERTAKING_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const responsibleUndertaking = this.store.select(notificationQuery.selectResponsibleUndertaking)();
    const hasOverseasParentDetails = responsibleUndertaking.hasOverseasParentDetails;

    switch (currentStep) {
      case ResponsibleUndertakingCurrentStep.REGISTRATION_NUMBER:
        return `../${ResponsibleUndertakingWizardStep.ORGANISATION_DETAILS}`;

      case ResponsibleUndertakingCurrentStep.ORGANISATION_DETAILS:
        return `../${ResponsibleUndertakingWizardStep.TRADING_DETAILS}`;

      case ResponsibleUndertakingCurrentStep.TRADING_DETAILS:
        return `../${ResponsibleUndertakingWizardStep.ORGANISATION_CONTACT_DETAILS}`;

      case ResponsibleUndertakingCurrentStep.ORGANISATION_CONTACT_DETAILS:
        return `../${ResponsibleUndertakingWizardStep.NOTIFICATION}`;

      case ResponsibleUndertakingCurrentStep.NOTIFICATION:
        return `../${ResponsibleUndertakingWizardStep.HAS_OVERSEAS_PARENT_DETAILS}`;

      case ResponsibleUndertakingCurrentStep.HAS_OVERSEAS_PARENT_DETAILS:
        return hasOverseasParentDetails
          ? `../${ResponsibleUndertakingWizardStep.OVERSEAS_PARENT_DETAILS}`
          : ResponsibleUndertakingWizardStep.SUMMARY;

      case ResponsibleUndertakingCurrentStep.OVERSEAS_PARENT_DETAILS:
        return ResponsibleUndertakingWizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}

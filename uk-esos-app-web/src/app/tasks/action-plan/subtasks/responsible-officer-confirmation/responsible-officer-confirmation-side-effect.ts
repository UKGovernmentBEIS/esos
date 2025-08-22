import { SideEffect } from '@common/forms/side-effects/side-effect';

import { ActionPlanP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME } from './responsible-officer-confirmation.helper';

export class ResponsibleOfficerConfirmationSideEffect extends SideEffect {
  subtask = RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME;

  apply<T extends ActionPlanP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return currentPayload;
  }
}

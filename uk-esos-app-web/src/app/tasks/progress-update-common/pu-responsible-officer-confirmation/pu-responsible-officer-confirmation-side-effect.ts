import { SideEffect } from '@common/forms/side-effects/side-effect';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME } from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

export class ProgressUpdateResponsibleOfficerConfirmationSideEffect extends SideEffect {
  subtask = PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME;

  apply<T extends ProgressUpdate1TaskPayload>(currentPayload: T): T;
  apply<T extends ProgressUpdate2TaskPayload>(currentPayload: T): T {
    return currentPayload;
  }
}

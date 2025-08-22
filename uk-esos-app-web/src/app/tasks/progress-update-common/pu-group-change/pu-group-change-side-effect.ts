import { SideEffect } from '@common/forms/side-effects/side-effect';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';

import { PU_GROUP_CHANGE_SUBTASK_NAME } from './pu-group-change.helper';

export class ProgressUpdateGroupChangeSideEffect extends SideEffect {
  subtask = PU_GROUP_CHANGE_SUBTASK_NAME;

  apply<T extends ProgressUpdate1TaskPayload>(currentPayload: T): T;
  apply<T extends ProgressUpdate2TaskPayload>(currentPayload: T): T {
    return currentPayload;
  }
}

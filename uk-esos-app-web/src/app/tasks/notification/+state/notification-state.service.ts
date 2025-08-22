import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';

import { ReportingObligation } from 'esos-api';

import { ReportingObligationCategory } from '../../../requests/common/reporting-obligation-category.types';
import { NotificationTaskPayload } from '../notification.types';

@Injectable()
export class NotificationStateService extends TaskStateService<NotificationTaskPayload> {
  private stagedPayload: NotificationTaskPayload;

  get payload(): NotificationTaskPayload {
    const payload = this.store.state.requestTaskItem.requestTask.payload as NotificationTaskPayload;

    return {
      ...payload,
      noc: payload.noc ?? {
        reportingObligation: {} as ReportingObligation,
      },
    };
  }

  get stagedChanges(): NotificationTaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: NotificationTaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: NotificationTaskPayload): void {
    this.store.setPayload(payload);
  }

  setLastReportingObligationCategory(lastReportingObligationCategory: ReportingObligationCategory) {
    this.store.setMetadata({
      ...this.store.state.metadata,
      lastReportingObligationCategory,
    });
  }
}

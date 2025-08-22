import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { ProgressUpdateResponsibleOfficerConfirmationComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { PROGRESS_UPDATE_COMMON_QUERY } from '@tasks/progress-update-common/+state';
import {
  ProgressUpdateResponsibleOfficerConfirmationStep,
  ProgressUpdateResponsibleOfficerConfirmationStepUrl,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-pu-responsible-officer-confirmation-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    ProgressUpdateResponsibleOfficerConfirmationComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  readonly puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  data = this.store.select(this.puCommonQuery.selectResponsibleOfficerConfirmation)();
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  isSubTaskCompleted =
    this.store.select(this.puCommonQuery.selectSectionsCompleted)()[
      PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME
    ] === TaskItemStatus.COMPLETED;
  readonly title = PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;
  readonly stepUrls = ProgressUpdateResponsibleOfficerConfirmationStepUrl;

  constructor(
    private readonly service: TaskService<ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload>,
    private readonly store: RequestTaskStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit() {
    this.service.submitSubtask({
      subtask: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ProgressUpdateResponsibleOfficerConfirmationStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

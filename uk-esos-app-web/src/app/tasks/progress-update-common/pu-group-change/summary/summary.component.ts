import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { ProgressUpdateGroupChangeSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { PROGRESS_UPDATE_COMMON_QUERY } from '@tasks/progress-update-common/+state';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import {
  ProgressUpdateGroupChangeStep,
  PU_GROUP_CHANGE_SUBTASK_NAME,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '../pu-group-change.helper';

@Component({
  selector: 'esos-pu-group-change-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    ProgressUpdateGroupChangeSummaryPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  readonly puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly data = this.store.select(this.puCommonQuery.selectGroupChange)();
  readonly isSubTaskCompleted =
    this.store.select(this.puCommonQuery.selectSectionsCompleted)()[PU_GROUP_CHANGE_SUBTASK_NAME] ===
    TaskItemStatus.COMPLETED;
  readonly title = PU_GROUP_CHANGE_SUBTASK_TITLE;

  constructor(
    private readonly service: TaskService<ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload>,
    private readonly store: RequestTaskStore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    if (this.activatedRoute.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit() {
    this.service.submitSubtask({
      subtask: PU_GROUP_CHANGE_SUBTASK_NAME,
      currentStep: ProgressUpdateGroupChangeStep.SUMMARY,
      route: this.activatedRoute,
      payload: this.service.payload,
    });
  }
}

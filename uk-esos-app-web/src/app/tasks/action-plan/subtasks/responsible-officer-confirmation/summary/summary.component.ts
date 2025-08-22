import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { ActionPlanResponsibleOfficerConfirmationComponent } from '@shared/components/summaries/action-plan-responsible-officer-confirmation-summary-page/action-plan-responsible-officer-confirmation-summary-page.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
  ResponsibleOfficerConfirmationStep,
  ResponsibleOfficerConfirmationStepUrl,
} from '../responsible-officer-confirmation.helper';

@Component({
  selector: 'esos-responsible-officer-confirmation-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
    ActionPlanResponsibleOfficerConfirmationComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  data = this.store.select(actionPlanQuery.selectResponsibleOfficerConfirmation)();
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  isSubTaskCompleted =
    this.store.select(actionPlanQuery.selectActionPlanSectionsCompleted)()[
      RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME
    ] === TaskItemStatus.COMPLETED;
  readonly title = RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;
  readonly stepUrls = ResponsibleOfficerConfirmationStepUrl;

  constructor(
    private readonly service: TaskService<ActionPlanTaskPayload>,
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
      subtask: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ResponsibleOfficerConfirmationStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ActionPlanResponsibleOfficerConfirmationComponent } from '@shared/components/summaries/action-plan-responsible-officer-confirmation-summary-page/action-plan-responsible-officer-confirmation-summary-page.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE } from '@tasks/action-plan/subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';
import { actionPlanApplicationTimelineQuery } from '@timeline/action-plan/+state/action-plan-application.selectors';

@Component({
  selector: 'esos-timeline-responsible-officer-confirmation',
  standalone: true,
  imports: [PageHeadingComponent, ActionPlanResponsibleOfficerConfirmationComponent],
  templateUrl: './responsible-officer-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResponsibleOfficerConfirmationTimelineComponent {
  data = this.store.select(actionPlanApplicationTimelineQuery.selectResponsibleOfficerConfirmation)();
  readonly title = RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;

  constructor(private readonly store: RequestActionStore) {}
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActionPlanReviewPipe } from '@shared/pipes/action-plan-review.pipe';
import { ResponsibleOfficerConfirmationStepUrl } from '@tasks/action-plan/subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';
import { REVIEW_CONTENT } from '@tasks/action-plan/subtasks/responsible-officer-confirmation/review/review-content';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ActionPlanP3 } from 'esos-api';

@Component({
  selector: 'esos-action-plan-responsible-officer-confirmation-summary-page',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    ButtonDirective,
    LinkDirective,
    ActionPlanReviewPipe,
  ],
  templateUrl: './action-plan-responsible-officer-confirmation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPlanResponsibleOfficerConfirmationComponent {
  isEditable = input<boolean>(false);
  data = input.required<ActionPlanP3['responsibleOfficerConfirmation']>();

  sortedData = computed(() =>
    this.reviewContentMap.options.filter((option) => (this.data() as string[]).includes(option)),
  );

  readonly stepUrls = ResponsibleOfficerConfirmationStepUrl;
  readonly reviewContentMap = REVIEW_CONTENT;
}

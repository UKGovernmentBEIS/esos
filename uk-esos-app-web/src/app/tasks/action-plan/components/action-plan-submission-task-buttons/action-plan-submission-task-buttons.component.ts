import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-action-plan-submission-task-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (isEditable()) {
      <div class="govuk-button-group">
        <a
          govukButton
          [routerLink]="hasCompletedAllSections() ? ['action-plan', 'submit'] : []"
          [disabled]="!hasCompletedAllSections()"
        >
          Submit to regulator
        </a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPlanSubmissionTaskButtonsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  hasCompletedAllSections = this.store.select(actionPlanQuery.selectCanSubmitActionPlan);

  constructor(readonly store: RequestTaskStore) {}
}

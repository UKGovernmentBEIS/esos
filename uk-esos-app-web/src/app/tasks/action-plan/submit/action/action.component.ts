import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-action-plan-submit-action',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, ReturnToTaskOrActionPageComponent],
  template: `
    <esos-page-heading class="govuk-!-margin-bottom-7" size="l">Submit to regulator</esos-page-heading>

    <p class="govuk-body govuk-!-margin-bottom-7">
      Your action plan will be sent directly to your regulator.
      <br />
      <br />
      By selecting 'Confirm and send' you confirm that the information in your action plan is correct to the best of
      your knowledge.
    </p>

    <div class="govuk-!-margin-bottom-4">
      <button class="govuk-!-margin-bottom-0" type="button" appPendingButton (click)="submit()" govukButton>
        Confirm and send
      </button>
    </div>
    <div class="govuk-!-margin-bottom-8">
      <esos-return-to-task-or-action-page />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPlanSubmitActionComponent {
  constructor(
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submit({
      subtask: 'submit',
      currentStep: 'action',
      route: this.route,
    });
  }
}

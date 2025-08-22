import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActionPlanReviewPipe } from '@shared/pipes/action-plan-review.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { hasOtherEstimationMethod } from '@tasks/action-plan/action-plan-task-content';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
  ResponsibleOfficerConfirmationStep,
} from '../responsible-officer-confirmation.helper';
import { REVIEW_CONTENT } from './review-content';
import { reviewFormProvider } from './review-form.provider';

@Component({
  selector: 'esos-review',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, SharedModule, ActionPlanReviewPipe],
  templateUrl: './review.component.html',
  providers: [reviewFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  protected readonly heading = REVIEW_CONTENT.title;
  protected readonly caption = RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;
  protected readonly legend = REVIEW_CONTENT.legend;
  protected readonly options = REVIEW_CONTENT.options;
  protected readonly regulation34AHint = `<a
    class="govuk-link"
    rel="noreferrer noopener"
    target="_blank"
    href="https://www.legislation.gov.uk/uksi/2014/1643/regulation/34A"
  >Read regulation 34A (opens in new tab)</a>`;

  secondConfirmationRequired = hasOtherEstimationMethod(
    this.store.select(actionPlanQuery.selectEnergyEfficiencyMeasures)(),
  );

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ResponsibleOfficerConfirmationStep.REVIEW,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (!payload.actionPlanP3.responsibleOfficerConfirmation) {
          payload.actionPlanP3.responsibleOfficerConfirmation = [];
        }

        payload.actionPlanP3.responsibleOfficerConfirmation = [
          ...this.form.get('responsibleOfficerConfirmation').value,
        ];
      }),
    });
  }
}

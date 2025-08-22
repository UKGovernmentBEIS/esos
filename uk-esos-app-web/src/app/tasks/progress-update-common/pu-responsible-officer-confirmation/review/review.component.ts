import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdateReviewPipe } from '@shared/pipes/pu-review.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { PROGRESS_UPDATE_COMMON_QUERY } from '@tasks/progress-update-common/+state';
import {
  hasOtherEstimationMethod,
  isProgressUpdate1,
  isProgressUpdate2,
} from '@tasks/progress-update-common/pu-common.helpers';
import {
  ProgressUpdateResponsibleOfficerConfirmationStep,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
  PU_REVIEW_CONTENT,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { reviewFormProvider } from './review-form.provider';

@Component({
  selector: 'esos-review',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, SharedModule, ProgressUpdateReviewPipe],
  templateUrl: './review.component.html',
  providers: [reviewFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  readonly puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
  protected readonly heading = PU_REVIEW_CONTENT.title;
  protected readonly caption = PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;
  protected readonly legend = PU_REVIEW_CONTENT.legend;
  protected readonly options = PU_REVIEW_CONTENT.options;
  protected readonly regulationHint = `<a
    class="govuk-link"
    rel="noreferrer noopener"
    target="_blank"
    href="https://www.legislation.gov.uk/uksi/2014/1643/regulation/34B"
  >Read regulation 34B (opens in new tab)</a>`;

  isSecondConfirmationRequired = hasOtherEstimationMethod(this.store.select(this.puCommonQuery.selectProgressUpdate)());

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ProgressUpdateResponsibleOfficerConfirmationStep.REVIEW,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (isProgressUpdate1(payload)) {
          payload.progressUpdate1P3.responsibleOfficerConfirmation = [
            ...this.form.get('responsibleOfficerConfirmation').value,
          ];
        } else if (isProgressUpdate2(payload)) {
          payload.progressUpdate2P3.responsibleOfficerConfirmation = [
            ...this.form.get('responsibleOfficerConfirmation').value,
          ];
        }
      }),
    });
  }
}

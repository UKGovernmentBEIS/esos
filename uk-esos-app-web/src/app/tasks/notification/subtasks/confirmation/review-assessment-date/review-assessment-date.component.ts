import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { CONFIRMATIONS_SUB_TASK, CurrentStep } from '../confirmation.helper';
import { ReviewAssessmentDateFormProvider } from './review-assessment-date-form.provider';

@Component({
  selector: 'esos-review-assessment-date',
  templateUrl: './review-assessment-date.component.html',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  providers: [ReviewAssessmentDateFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReviewAssessmentDateComponent {
  today = new Date(new Date().setDate(new Date().getDate()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: CONFIRMATIONS_SUB_TASK,
      currentStep: CurrentStep.ASSESSMENT_DATE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.confirmations = {
          ...payload.noc.confirmations,
          reviewAssessmentDate: this.form.controls.reviewAssessmentDate.value,
        };
      }),
    });
  }
}

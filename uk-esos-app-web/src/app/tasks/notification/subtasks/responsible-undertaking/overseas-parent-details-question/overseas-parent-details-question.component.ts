import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { overseasParentDetailsQuestionFormProvider } from '@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details-question/overseas-parent-details-question-form.provider';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextInputComponent,
} from 'govuk-components';

@Component({
  selector: 'esos-overseas-parent-details-question',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    TextInputComponent,
    ConditionalContentDirective,
    RadioComponent,
    RadioOptionComponent,
  ],
  templateUrl: './overseas-parent-details-question.component.html',
  providers: [overseasParentDetailsQuestionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverseasParentDetailsQuestionComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.HAS_OVERSEAS_PARENT_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking.hasOverseasParentDetails = this.form.controls.hasOverseasParentDetails.value;
      }),
    });
  }
}

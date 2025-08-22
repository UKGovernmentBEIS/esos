import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { overseasParentDetailsFormProvider } from '@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details/overseas-parent-details-form.provider';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent, TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-overseas-parent-details',
  standalone: true,
  imports: [RadioComponent, WizardStepComponent, ReactiveFormsModule, RadioOptionComponent, TextInputComponent],
  templateUrl: './overseas-parent-details.component.html',
  providers: [overseasParentDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverseasParentDetailsComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.OVERSEAS_PARENT_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking.overseasParentDetails = this.form.value;
      }),
    });
  }
}

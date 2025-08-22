import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  ConditionalContentDirective,
  DetailsComponent,
  RadioComponent,
  RadioOptionComponent,
  TextInputComponent,
} from 'govuk-components';

import { notificationFormProvider } from './notification-form.provider';

@Component({
  selector: 'esos-notification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    WizardStepComponent,
    RadioOptionComponent,
    RadioComponent,
    ConditionalContentDirective,
    DetailsComponent,
  ],
  templateUrl: './notification.component.html',
  providers: [notificationFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.NOTIFICATION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking = {
          ...payload.noc.responsibleUndertaking,
          isBehalfOfTrust: this.form.controls.isBehalfOfTrust.value,
          trustName: this.form.controls.isBehalfOfTrust.value === true ? this.form.controls.trustName.value : undefined,
        };
      }),
    });
  }
}

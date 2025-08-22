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
  RadioComponent,
  RadioOptionComponent,
  TextInputComponent,
} from 'govuk-components';

import { tradingDetailsFormProvider } from './trading-details-form.provider';

@Component({
  selector: 'esos-trading-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    WizardStepComponent,
    RadioOptionComponent,
    RadioComponent,
    ConditionalContentDirective,
  ],
  templateUrl: './trading-details.component.html',
  providers: [tradingDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingDetailsComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.TRADING_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking.tradingDetails = this.form.value;
      }),
    });
  }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK, EnergySavingsAchievedCurrentStep } from '../energy-savings-achieved.helper';
import { energySavingsAchievedDetailsFormProvider } from './energy-savings-achieved-details-form.provider';

@Component({
  selector: 'esos-energy-savings-achieved-details',
  templateUrl: './energy-savings-achieved-details.component.html',
  standalone: true,
  imports: [GovukComponentsModule, ReactiveFormsModule, WizardStepComponent],
  providers: [energySavingsAchievedDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedDetailsComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsAchieved = {
          ...payload.noc.energySavingsAchieved,
          ...this.form.value,
        };
      }),
    });
  }
}

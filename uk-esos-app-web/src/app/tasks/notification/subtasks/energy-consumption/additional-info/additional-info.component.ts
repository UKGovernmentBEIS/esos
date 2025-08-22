import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { additionalInfoFormProvider } from '@tasks/notification/subtasks/energy-consumption/additional-info/additional-info-form.provider';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-additional-info',
  standalone: true,
  imports: [WizardStepComponent, ReactiveFormsModule, SharedModule],
  templateUrl: './additional-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [additionalInfoFormProvider],
})
export class AdditionalInfoComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.ADDITIONAL_INFO,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energyConsumptionDetails = {
          ...payload.noc.energyConsumptionDetails,
          ...this.form.value,
        };
      }),
    });
  }
}

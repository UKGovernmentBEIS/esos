import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { useSignificantEnergyFormProvider } from '@tasks/notification/subtasks/energy-consumption/use-significant-energy/use-significant-energy-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-use-significant-energy',
  standalone: true,
  imports: [WizardStepComponent, SharedModule],
  templateUrl: './use-significant-energy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [useSignificantEnergyFormProvider],
})
export class UseSignificantEnergyComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.USE_SIGNIFICANT_ENERGY,
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

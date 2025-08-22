import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getEnergyConsumptionTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { totalEnergyFormProvider } from '@tasks/notification/subtasks/energy-consumption/total-energy/total-energy-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { EnergyConsumption } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-total-energy',
  standalone: true,
  imports: [WizardStepComponent, EnergyConsumptionInputComponent, ReactiveFormsModule],
  templateUrl: './total-energy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [totalEnergyFormProvider],
})
export class TotalEnergyComponent {
  private formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  total: Signal<number> = computed(() => getEnergyConsumptionTotalSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.TOTAL_ENERGY,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energyConsumptionDetails = {
          ...payload.noc.energyConsumptionDetails,
          totalEnergyConsumption: {
            buildings: +this.form.get('buildings').value,
            transport: +this.form.get('transport').value,
            industrialProcesses: +this.form.get('industrialProcesses').value,
            otherProcesses: +this.form.get('otherProcesses').value,
            total: this.total(),
          },
        };
      }),
    });
  }
}

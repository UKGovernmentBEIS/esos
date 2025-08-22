import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { getEnergyConsumptionTotalSum } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { EnergyConsumption } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK, EnergySavingsAchievedCurrentStep } from '../energy-savings-achieved.helper';
import { energySavingsAchievedEstimateFormProvider } from './energy-savings-achieved-estimate-form.provider';

@Component({
  selector: 'esos-energy-savings-achieved-estimate',
  templateUrl: './energy-savings-achieved-estimate.component.html',
  standalone: true,
  imports: [GovukComponentsModule, ReactiveFormsModule, WizardStepComponent, EnergyConsumptionInputComponent],
  providers: [energySavingsAchievedEstimateFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedEstimateComponent {
  private formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  totalkWh: Signal<number> = computed(() => getEnergyConsumptionTotalSum(this.formData()));

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.ESTIMATE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energySavingsAchieved = {
          ...payload.noc.energySavingsAchieved,
          energySavingsEstimation: {
            buildings: +this.form.get('buildings').value,
            transport: +this.form.get('transport').value,
            industrialProcesses: +this.form.get('industrialProcesses').value,
            otherProcesses: +this.form.get('otherProcesses').value,
            total: this.totalkWh(),
          },
        };
      }),
    });
  }
}

import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  getEnergyConsumptionTotalSum,
  getSignificantPercentage,
} from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import { significantEnergyFormProvider } from '@tasks/notification/subtasks/energy-consumption/significant-energy/significant-energy-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { SignificantEnergyConsumption } from 'esos-api';

@Component({
  selector: 'esos-significant-energy-consumption',
  standalone: true,
  imports: [WizardStepComponent, EnergyConsumptionInputComponent, ReactiveFormsModule],
  templateUrl: './significant-energy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [significantEnergyFormProvider],
})
export class SignificantEnergyComponent {
  private formData: Signal<SignificantEnergyConsumption> = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  total: Signal<number> = computed(() => getEnergyConsumptionTotalSum(this.formData()));
  percentage: Signal<number> = computed(() =>
    getSignificantPercentage(
      this.store.select(notificationQuery.selectEnergyConsumption)().totalEnergyConsumption.total,
      this.total(),
    ),
  );

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private store: RequestTaskStore,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.SIGNIFICANT_ENERGY,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energyConsumptionDetails = {
          ...payload.noc.energyConsumptionDetails,
          significantEnergyConsumption: {
            buildings: +this.form.get('buildings').value,
            transport: +this.form.get('transport').value,
            industrialProcesses: +this.form.get('industrialProcesses').value,
            otherProcesses: +this.form.get('otherProcesses').value,
            total: this.total(),
            significantEnergyConsumptionPct: this.percentage(),
          },
        };
      }),
    });
  }
}

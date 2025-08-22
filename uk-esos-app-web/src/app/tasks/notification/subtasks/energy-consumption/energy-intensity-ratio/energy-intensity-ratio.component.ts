import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { EnergyIntensityRatioInputComponent } from '@shared/components/energy-intensity-ratio-input/energy-intensity-ratio-input.component';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
  getEnergyConsumptionHeading,
  getSignificantOrTotalEnergyConsumption,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import {
  createEnergyIntensityRatio,
  energyIntensityRatioFormProvider,
} from '@tasks/notification/subtasks/energy-consumption/energy-intensity-ratio/energy-intensity-ratio-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-energy-intensity-ratio',
  standalone: true,
  imports: [WizardStepComponent, ReactiveFormsModule, EnergyIntensityRatioInputComponent, SharedModule, RouterLink],
  templateUrl: './energy-intensity-ratio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyIntensityRatioFormProvider],
})
export class EnergyIntensityRatioComponent {
  protected readonly energyConsumption = getSignificantOrTotalEnergyConsumption(
    this.store.select(notificationQuery.selectEnergyConsumption)(),
  );

  protected readonly heading = getEnergyConsumptionHeading(
    this.store.select(notificationQuery.selectEnergyConsumption)()?.significantEnergyConsumptionExists,
  );

  get buildingsIntensityRatioFormArray() {
    return this.form.get('buildings')?.get('energyIntensityRatios') as FormArray;
  }

  get transportIntensityRatioFormArray() {
    return this.form.get('transport')?.get('energyIntensityRatios') as FormArray;
  }

  get industrialProcessesIntensityRatioFormArray() {
    return this.form.get('industrialProcesses')?.get('energyIntensityRatios') as FormArray;
  }

  get otherProcessesIntensityRatiosFormArray() {
    return this.form.get('otherProcesses')?.get('energyIntensityRatios') as FormArray;
  }

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  addRatioGroup(type: string): void {
    (this.form.get(type).get('energyIntensityRatios') as FormArray).push(createEnergyIntensityRatio());
  }

  deleteRatioGroup(event: { type: string; index: number }): void {
    (this.form.get(event.type).get('energyIntensityRatios') as FormArray).removeAt(event.index);
  }

  submit() {
    this.service.saveSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.ENERGY_INTENSITY_RATIO,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.energyConsumptionDetails = {
          ...payload.noc.energyConsumptionDetails,
          energyIntensityRatioData: {
            ...this.form.value,
          },
        };
      }),
    });
  }
}

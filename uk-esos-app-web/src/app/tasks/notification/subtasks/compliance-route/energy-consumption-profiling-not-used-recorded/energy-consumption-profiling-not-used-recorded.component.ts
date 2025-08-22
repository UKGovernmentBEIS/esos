import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep } from '../compliance-route.helper';
import { energyConsumptionProfilingNotUsedRecordedFormProvider } from './energy-consumption-profiling-not-used-recorded-form.provider';

@Component({
  selector: 'esos-energy-consumption-profiling-not-used-recorded',
  standalone: true,
  imports: [ReactiveFormsModule, RadioOptionComponent, RadioComponent, WizardStepComponent],
  templateUrl: './energy-consumption-profiling-not-used-recorded.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyConsumptionProfilingNotUsedRecordedFormProvider],
})
export class EnergyConsumptionProfilingNotUsedRecordedComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const isEnergyConsumptionProfilingNotUsedRecorded = this.form.value.isEnergyConsumptionProfilingNotUsedRecorded;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_PROFILING_NOT_USED_RECORDED,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          isEnergyConsumptionProfilingNotUsedRecorded: isEnergyConsumptionProfilingNotUsedRecorded,
        };
      }),
    });
  }
}

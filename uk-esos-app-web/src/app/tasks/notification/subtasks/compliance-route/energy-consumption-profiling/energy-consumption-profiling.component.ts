import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { NotApplicablePipe } from '@shared/pipes/not-applicable.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep } from '../compliance-route.helper';
import { energyConsumptionProfilingFormProvider } from './energy-consumption-profiling-form.provider';

@Component({
  selector: 'esos-energy-consumption-profiling',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, NotApplicablePipe],
  templateUrl: './energy-consumption-profiling.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyConsumptionProfilingFormProvider],
})
export class EnergyConsumptionProfilingComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const energyConsumptionProfilingUsed = this.form.value.energyConsumptionProfilingUsed;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_PROFILING,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          energyConsumptionProfilingUsed: energyConsumptionProfilingUsed,
        };
      }),
    });
  }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SkipQuestionPipe } from '@shared/pipes/skip-question.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep } from '../compliance-route.helper';
import { energyConsumptionProfilingMethodsRecordedFormProvider } from './energy-consumption-profiling-methods-recorded-form.provider';

@Component({
  selector: 'esos-energy-consumption-profiling-methods-recorded',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, SkipQuestionPipe],
  templateUrl: './energy-consumption-profiling-methods-recorded.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyConsumptionProfilingMethodsRecordedFormProvider],
})
export class EnergyConsumptionProfilingMethodsRecordedComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const areEnergyConsumptionProfilingMethodsRecorded = this.form.value.areEnergyConsumptionProfilingMethodsRecorded;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          areEnergyConsumptionProfilingMethodsRecorded: areEnergyConsumptionProfilingMethodsRecorded,
        };
      }),
    });
  }
}

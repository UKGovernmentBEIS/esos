import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { getEnergyConsumptionTotalSumOrNull } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { reductionAchievedFormProvider } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/reduction-achieved/reduction-achieved-form.provider';
import {
  CurrentStep,
  getCompliancePeriodHint,
  SUB_TASK_SECOND_COMPLIANCE_PERIOD,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, RadioComponent, RadioOptionComponent } from 'govuk-components';

import { EnergyConsumption } from 'esos-api';

@Component({
  selector: 'esos-reduction-achieved',
  templateUrl: './reduction-achieved.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RadioOptionComponent,
    WizardStepComponent,
    RadioComponent,
    EnergyConsumptionInputComponent,
    DetailsComponent,
    NgIf,
    NoDataEnteredPipe,
  ],
  providers: [reductionAchievedFormProvider],
})
export class ReductionAchievedComponent {
  heading = WIZARD_STEP_HEADINGS[WizardStep.REDUCTION_ACHIEVED](false);
  hint = getCompliancePeriodHint(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    private store: RequestTaskStore,
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
  ) {}

  formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  total: Signal<number> = computed(() => getEnergyConsumptionTotalSumOrNull(this.formData()));

  submit(): void {
    this.service.saveSubtask({
      subtask: SUB_TASK_SECOND_COMPLIANCE_PERIOD,
      currentStep: CurrentStep.REDUCTION_ACHIEVED,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.secondCompliancePeriod = {
          ...payload.noc.secondCompliancePeriod,
          reductionAchieved: {
            ...this.form.value,
            total: this.total(),
          },
        };
      }),
    });
  }
}

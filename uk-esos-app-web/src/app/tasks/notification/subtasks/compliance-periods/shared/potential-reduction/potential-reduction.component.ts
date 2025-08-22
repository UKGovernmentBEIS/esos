import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, OnInit, Signal } from '@angular/core';
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
import {
  CurrentStep,
  getCompliancePeriodHint,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { potentialReductionFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/potential-reduction/potential-reduction-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, RadioComponent, RadioOptionComponent } from 'govuk-components';

import { EnergyConsumption } from 'esos-api';

import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-potential-reduction',
  templateUrl: './potential-reduction.component.html',
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
  providers: [potentialReductionFormProvider],
})
export class PotentialReductionComponent implements OnInit {
  isFirstCompliancePeriod: boolean;
  heading: string;
  hint: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    private store: RequestTaskStore,
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {}

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.POTENTIAL_REDUCTION](this.isFirstCompliancePeriod);
    this.hint = getCompliancePeriodHint(this.isFirstCompliancePeriod);
  }

  formData: Signal<EnergyConsumption> = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  total: Signal<number> = computed(() => getEnergyConsumptionTotalSumOrNull(this.formData()));

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.POTENTIAL_REDUCTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails,
            potentialReduction: {
              ...this.form.value,
              total: this.total(),
            },
          };
        } else {
          payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails,
            potentialReduction: {
              ...this.form.value,
              total: this.total(),
            },
          };
        }
      }),
    });
  }
}

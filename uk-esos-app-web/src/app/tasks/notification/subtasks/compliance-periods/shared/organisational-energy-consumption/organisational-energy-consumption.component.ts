import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriod,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import {
  CurrentStep,
  getCompliancePeriodHint,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { organisationalEnergyConsumptionFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/organisational-energy-consumption/organisational-energy-consumption-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-total-energy-consumption-breakdown',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, WizardStepComponent],
  templateUrl: './organisational-energy-consumption.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [organisationalEnergyConsumptionFormProvider],
})
export class OrganisationalEnergyConsumptionComponent implements OnInit {
  isFirstCompliancePeriod: boolean;
  heading: string;
  hint: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {}

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION](this.isFirstCompliancePeriod);
    this.hint = getCompliancePeriodHint(this.isFirstCompliancePeriod);
  }

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.ORGANISATIONAL_ENERGY_CONSUMPTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails,
            organisationalEnergyConsumption: this.form.value.organisationalEnergyConsumption,
          };
        } else {
          payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails = {
            ...payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails,
            organisationalEnergyConsumption: this.form.value.organisationalEnergyConsumption,
          };
        }
      }),
    });
  }
}

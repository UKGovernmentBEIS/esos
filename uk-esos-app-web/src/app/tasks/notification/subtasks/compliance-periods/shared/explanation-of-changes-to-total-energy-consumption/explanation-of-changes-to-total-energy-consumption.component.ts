import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { explanationOfChangesToTotalEnergyConsumptionFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/explanation-of-changes-to-total-energy-consumption/explanation-of-changes-to-total-energy-consumption-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-explanation-of-changes-total-energy-consumption',
  templateUrl: './explanation-of-changes-to-total-energy-consumption.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioOptionComponent, WizardStepComponent, RadioComponent, SharedModule, NgIf],
  providers: [explanationOfChangesToTotalEnergyConsumptionFormProvider],
})
export class ExplanationOfChangesToTotalEnergyConsumptionComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isFirstCompliancePeriod: boolean;
  heading: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    private store: RequestTaskStore,
    @Inject(TASK_FORM) private readonly explanationOfChangesToTotalEnergyConsumptionForm: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {
    this.formGroup = this.explanationOfChangesToTotalEnergyConsumptionForm;
  }

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION](
      this.isFirstCompliancePeriod,
    );
  }

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails.explanation = this.formGroup.value.explanation;
        } else {
          payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails.explanation =
            this.formGroup.value.explanation;
        }
      }),
    });
  }
}

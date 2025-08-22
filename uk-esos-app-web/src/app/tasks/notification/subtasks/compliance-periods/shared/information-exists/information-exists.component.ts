import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { SkipQuestionPipe } from '@shared/pipes/skip-question.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  getCompliancePeriodHint,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { informationExistsFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/information-exists/information-exists-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-information-exists',
  templateUrl: './information-exists.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioOptionComponent, WizardStepComponent, RadioComponent, NgIf, SkipQuestionPipe],
  providers: [informationExistsFormProvider],
})
export class InformationExistsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isFirstCompliancePeriod: boolean;
  heading: string;
  hint: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    private store: RequestTaskStore,
    @Inject(TASK_FORM) private readonly complianceHistoricalInformationForm: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {
    this.formGroup = this.complianceHistoricalInformationForm;
  }

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.INFORMATION_EXISTS](this.isFirstCompliancePeriod);
    this.hint = getCompliancePeriodHint(this.isFirstCompliancePeriod);
  }

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.INFORMATION_EXISTS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod = {
            ...payload.noc.firstCompliancePeriod,
            informationExists: this.formGroup.value.informationExists,
          };
        } else {
          payload.noc.secondCompliancePeriod = {
            ...payload.noc.secondCompliancePeriod,
            informationExists: this.formGroup.value.informationExists,
          };
        }
      }),
    });
  }
}

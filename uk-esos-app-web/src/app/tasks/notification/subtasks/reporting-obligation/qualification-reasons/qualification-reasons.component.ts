import { KeyValuePipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { PipesModule } from '@shared/pipes/pipes.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { CheckboxComponent, RadioComponent, RadioOptionComponent } from 'govuk-components';

import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';
import { QualificationReasonsFormModel, qualificationReasonsFormProvider } from './qualification-reasons-form.provider';

@Component({
  selector: 'esos-qualification-reasons',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    CheckboxComponent,
    KeyValuePipe,
    NgForOf,
    PipesModule,
  ],
  templateUrl: './qualification-reasons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [qualificationReasonsFormProvider],
})
export class QualificationReasonsComponent {
  protected isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;

  constructor(
    @Inject(TASK_FORM) protected readonly form: FormGroup<QualificationReasonsFormModel>,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.QUALIFICATION_REASONS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (!payload.noc.reportingObligation.reportingObligationDetails) {
          payload.noc.reportingObligation.reportingObligationDetails = {} as any;
        }
        payload.noc.reportingObligation.reportingObligationDetails.qualificationReasonType =
          this.form.value.qualificationReason;
      }),
      applySideEffects: false,
    });
  }
}

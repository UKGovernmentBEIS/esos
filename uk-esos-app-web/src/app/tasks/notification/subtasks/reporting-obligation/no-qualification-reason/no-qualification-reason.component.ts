import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, LinkDirective, TextareaComponent } from 'govuk-components';

import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';
import {
  NoQualificationReasonFormModel,
  noQualificationReasonFormProvider,
} from './no-qualification-reason-form.provider';

@Component({
  selector: 'esos-no-qualification-reason',
  standalone: true,
  templateUrl: './no-qualification-reason.component.html',
  imports: [WizardStepComponent, ReactiveFormsModule, TextareaComponent, DetailsComponent, LinkDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [noQualificationReasonFormProvider],
})
export class NoQualificationReasonComponent {
  protected isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  protected accountId = this.store.select(requestTaskQuery.selectRequestInfo)()?.accountId;
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;

  constructor(
    @Inject(TASK_FORM) protected readonly form: FormGroup<NoQualificationReasonFormModel>,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.NO_QUALIFICATION_REASON,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.reportingObligation.noQualificationReason = this.form.value.noQualificationReason;
      }),
      applySideEffects: false,
    });
  }
}

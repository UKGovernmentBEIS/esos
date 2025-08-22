import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { InternalExternalPipe } from '@shared/pipes/internal-external.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { LEAD_ASSESSOR_DETAILS_SUB_TASK, LeadAssessorDetailsCurrentStep } from '../lead-assessor-details.helper';
import { LeadAssessorTypeFormProvider } from './lead-assessor-type-form.provider';

@Component({
  selector: 'esos-lead-assessor-type',
  templateUrl: './lead-assessor-type.component.html',
  standalone: true,
  imports: [InternalExternalPipe, SharedModule, WizardStepComponent],
  providers: [LeadAssessorTypeFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadAssessorTypeComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  constructor(
    @Inject(REQUEST_TASK_PAGE_CONTENT) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: LEAD_ASSESSOR_DETAILS_SUB_TASK,
      currentStep: LeadAssessorDetailsCurrentStep.TYPE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.leadAssessor = {
          ...payload.noc.leadAssessor,
          leadAssessorType: this.form.controls.leadAssessorType.value,
        };
      }),
    });
  }
}

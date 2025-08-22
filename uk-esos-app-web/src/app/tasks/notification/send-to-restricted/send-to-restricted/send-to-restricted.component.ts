import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { TaskServiceExtended } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukComponentsModule } from 'govuk-components';

import { TasksAssignmentService } from 'esos-api';

import { sendNotificationFormProvider } from './send-to-restricted-form.provider';

@Component({
  selector: 'esos-send-to-restricted',
  standalone: true,
  imports: [PageHeadingComponent, WizardStepComponent, GovukComponentsModule, ReactiveFormsModule],
  templateUrl: './send-to-restricted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [sendNotificationFormProvider],
})
export class SendToRestrictedComponent {
  private requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
  protected candidateAssignees = toSignal(
    this.tasksAssignmentService
      .getCandidateAssigneesByTaskType(this.requestTaskId, 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT')
      .pipe(
        map((v) => {
          return v.map((item) => {
            return { text: `${item.firstName} ${item.lastName}`, value: item.id };
          });
        }),
      ),
  );

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly store: RequestTaskStore,
    private readonly tasksAssignmentService: TasksAssignmentService,
    private readonly service: TaskServiceExtended<NotificationTaskPayload>,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.sendToRestricted({
      subtask: 'sendToRestricted',
      userId: this.form.value.user,
      data: {
        participantFullName: this.getUserFullName(),
      },
      currentStep: 'action',
      route: this.route,
    });
  }

  private getUserFullName(): string {
    return this.candidateAssignees().find((option) => option.value === this.form.value.user)?.text ?? '';
  }
}

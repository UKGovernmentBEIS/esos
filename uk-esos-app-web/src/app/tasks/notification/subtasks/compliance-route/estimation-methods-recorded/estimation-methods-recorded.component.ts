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
import { estimationMethodsRecordedFormProvider } from './estimation-methods-recorded-form.provider';

@Component({
  selector: 'esos-estimation-methods-recorded',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, SkipQuestionPipe],
  templateUrl: './estimation-methods-recorded.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [estimationMethodsRecordedFormProvider],
})
export class EstimationMethodsRecordedComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const areEstimationMethodsRecorded = this.form.value.areEstimationMethodsRecorded;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.ESTIMATION_METHODS_RECORDED,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          areEstimationMethodsRecorded: areEstimationMethodsRecorded,
        };
      }),
    });
  }
}

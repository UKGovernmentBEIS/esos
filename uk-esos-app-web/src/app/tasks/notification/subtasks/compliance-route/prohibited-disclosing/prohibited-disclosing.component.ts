import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep } from '../compliance-route.helper';
import { prohibitedDisclosingFormProvider } from './prohibited-disclosing-form.provider';

@Component({
  selector: 'esos-prohibited-disclosing',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './prohibited-disclosing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [prohibitedDisclosingFormProvider],
})
export class ProhibitedDisclosingComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const partsProhibitedFromDisclosingExist = this.form.value.partsProhibitedFromDisclosingExist;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.PROHIBITED_DISCLOSING,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          partsProhibitedFromDisclosingExist: partsProhibitedFromDisclosingExist,
        };
      }),
    });
  }
}

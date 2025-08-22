import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { highestParentFormProvider } from '@tasks/notification/subtasks/organisation-structure/highest-parent/highest-parent-form.provider';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-highest-parent',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './highest-parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [highestParentFormProvider],
})
export class HighestParentComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.HIGHEST_PARENT,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = { ...payload.noc.organisationStructure, ...this.form.value };
      }),
    });
  }
}

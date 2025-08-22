import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { includeUndertakingsFormProvider } from '@tasks/notification/subtasks/organisation-structure/include-undertakings/include-undertakings-form.provider';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-include-undertakings',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './include-undertakings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [includeUndertakingsFormProvider],
})
export class IncludeUndertakingsComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.INCLUDE_UNDERTAKINGS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = { ...payload.noc.organisationStructure, ...this.form.value };
      }),
    });
  }
}

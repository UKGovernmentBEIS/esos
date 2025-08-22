import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
} from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import {
  addOrganisationUndertakingDetails,
  undertakingListFormProvider,
} from '@tasks/notification/subtasks/organisation-structure/undertaking-list/undertaking-list-form-provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

@Component({
  selector: 'esos-undertaking-list',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, RouterLink],
  templateUrl: './undertaking-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [undertakingListFormProvider],
})
export class UndertakingListComponent {
  organisationsFormArray = this.form.get('organisations') as UntypedFormArray;

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  addOrganisation() {
    this.organisationsFormArray.push(addOrganisationUndertakingDetails());
  }

  removeOrganisation(index: number) {
    this.organisationsFormArray.removeAt(index);
  }

  submit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.UNDERTAKING_LIST,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = {
          ...payload.noc.organisationStructure,
          organisationUndertakingDetails: this.organisationsFormArray.controls.map((control) => control.value),
        };
      }),
    });
  }
}

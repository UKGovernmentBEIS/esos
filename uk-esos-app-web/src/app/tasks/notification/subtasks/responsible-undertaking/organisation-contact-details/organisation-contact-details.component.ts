import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { organisationContactDetailsFormProvider } from './organisation-contact-details-form.provider';

@Component({
  selector: 'esos-organisation-contact-details',
  standalone: true,
  imports: [WizardStepComponent, SharedModule],
  templateUrl: './organisation-contact-details.component.html',
  providers: [organisationContactDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationContactDetailsComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.ORGANISATION_CONTACT_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking.organisationContactDetails = this.form.value;
      }),
    });
  }
}

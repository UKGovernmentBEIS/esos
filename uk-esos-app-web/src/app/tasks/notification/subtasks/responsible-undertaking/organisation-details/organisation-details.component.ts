import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { ActivityCodesGuidanceTemplateComponent } from '@shared/components/activity-codes-guidance-template/activity-codes-guidance-template.component';
import { ActivityCodesInputComponent } from '@shared/components/activity-codes-input/activity-codes-input.component';
import { SharedModule } from '@shared/shared.module';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { organisationDetailsFormProvider } from './organisation-details-form.provider';

@Component({
  selector: 'esos-organisation-details',
  standalone: true,
  imports: [WizardStepComponent, SharedModule, SummaryHeaderComponent, ActivityCodesInputComponent, ActivityCodesGuidanceTemplateComponent],
  templateUrl: './organisation-details.component.html',
  providers: [organisationDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailsComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.ORGANISATION_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking = {
          ...payload.noc.responsibleUndertaking,
          organisationDetails: {
            ...payload.noc.responsibleUndertaking.organisationDetails,
            ...this.form.value,
            otherTypeName:
              this.form.controls.type.value === 'OTHER' ? this.form.controls.otherTypeName.value : undefined,
          },
        };
      }),
    });
  }
}

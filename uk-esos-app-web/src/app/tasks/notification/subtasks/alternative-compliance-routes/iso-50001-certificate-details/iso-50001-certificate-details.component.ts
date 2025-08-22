import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { iso50001CertificateDetailsFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/iso-50001-certificate-details/iso-50001-certificate-details-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DateInputComponent, TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-iso-50001-certificate-details',
  standalone: true,
  imports: [WizardStepComponent, TextInputComponent, ReactiveFormsModule, DateInputComponent],
  templateUrl: './iso-50001-certificate-details.component.html',
  providers: [iso50001CertificateDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Iso50001CertificateDetailsComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
  dateHint = 'For example, 27 3 2023.<br/>This can be found after the “Scope” section on your certificate.';

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ISO_50001_CERTIFICATE_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes.iso50001CertificateDetails = this.form.value;
      }),
    });
  }
}

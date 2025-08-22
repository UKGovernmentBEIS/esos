import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  addCertificateDetailsGroup,
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { gdaCertificatesDetailsFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/gda-certificates-details/gda-certificates-details-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { ButtonDirective, DateInputComponent, LinkDirective, TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-gda-certificates-details',
  standalone: true,
  imports: [
    ButtonDirective,
    WizardStepComponent,
    ReactiveFormsModule,
    NgForOf,
    TextInputComponent,
    DateInputComponent,
    LinkDirective,
    NgIf,
  ],
  templateUrl: './gda-certificates-details.component.html',
  providers: [gdaCertificatesDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GdaCertificatesDetailsComponent {
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
      currentStep: CurrentStep.GDA_CERTIFICATES_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes.gdaCertificatesDetails = this.form.value;
      }),
    });
  }

  get certificateDetailsFormArray(): UntypedFormArray {
    return this.form.get('certificateDetails') as UntypedFormArray;
  }

  addCertificateDetails(): void {
    const certificateDetails = this.certificateDetailsFormArray;
    certificateDetails.push(addCertificateDetailsGroup('gdaCertificatesDetails'));
    certificateDetails.at(certificateDetails.length - 1);
  }

  removeCertificateDetails(index: number) {
    this.certificateDetailsFormArray.removeAt(index);
  }
}

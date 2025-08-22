import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  addCertificateDetailsGroup,
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { decCertificatesDetailsFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/dec-certificates-details/dec-certificates-details-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { ButtonDirective, DateInputComponent, LinkDirective, TextInputComponent } from 'govuk-components';

@Component({
  selector: 'esos-dec-certificates-details',
  standalone: true,
  templateUrl: './dec-certificates-details.component.html',
  providers: [decCertificatesDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateInputComponent,
    ReactiveFormsModule,
    TextInputComponent,
    WizardStepComponent,
    NgForOf,
    ButtonDirective,
    AsyncPipe,
    LinkDirective,
    RouterLink,
    NgIf,
  ],
})
export class DecCertificatesDetailsComponent {
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
      currentStep: CurrentStep.DEC_CERTIFICATES_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes.decCertificatesDetails = this.form.value;
      }),
    });
  }

  get certificateDetailsFormArray(): UntypedFormArray {
    return this.form.get('certificateDetails') as UntypedFormArray;
  }

  addCertificateDetails(): void {
    const certificateDetails = this.certificateDetailsFormArray;
    certificateDetails.push(addCertificateDetailsGroup('decCertificatesDetails'));
    certificateDetails.at(certificateDetails.length - 1);
  }

  removeCertificateDetails(index: number) {
    this.certificateDetailsFormArray.removeAt(index);
  }
}

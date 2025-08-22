import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { InternalExternalPipe } from '@shared/pipes/internal-external.pipe';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { NocP3, PersonnelDetails } from 'esos-api';

import {
  ASSESSMENT_PERSONNEL_SUB_TASK,
  AssessmentPersonnelCurrentStep,
  sortPersonnel,
} from '../assessment-personnel.helper';
import { PersonFormFormProvider } from './personnel-form.provider';

@Component({
  selector: 'esos-personnel',
  templateUrl: './personnel.component.html',
  standalone: true,
  imports: [GovukComponentsModule, InternalExternalPipe, ReactiveFormsModule, WizardStepComponent],
  providers: [PersonFormFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonnelComponent implements OnInit {
  private personIndex: number;

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.has('personIndex')) {
      this.personIndex = +this.route.snapshot.paramMap.get('personIndex');
      const personnel = this.store.select(notificationQuery.selectAssessmentPersonnel)().personnel;

      this.form.setValue(personnel[this.personIndex]);
    }
  }

  submit() {
    this.service.saveSubtask({
      subtask: ASSESSMENT_PERSONNEL_SUB_TASK,
      currentStep:
        this.personIndex != null ? AssessmentPersonnelCurrentStep.FORM : AssessmentPersonnelCurrentStep.FORM_ADD,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const payloadPersonnel = payload.noc?.assessmentPersonnel?.personnel ?? [];

        if (this.personIndex != null) {
          const updatedPersonnel = payloadPersonnel.map((p, index) => {
            return index === +this.personIndex ? (this.form.value as PersonnelDetails) : p;
          });

          payload.noc = {
            ...(payload.noc ?? {}),
            assessmentPersonnel: {
              personnel: sortPersonnel(updatedPersonnel),
            },
          } as NocP3;
        } else {
          payload.noc = {
            ...(payload.noc ?? {}),
            assessmentPersonnel: {
              personnel: sortPersonnel([...payloadPersonnel, this.form.value]),
            },
          } as NocP3;
        }
      }),
    });
  }
}

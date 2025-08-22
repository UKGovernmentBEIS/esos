import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { first, map, of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { OrganisationCompaniesHouseFormComponent } from '@shared/components/organisation-companies-house-form';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { organisationRegistrationNumberFormProvider } from '@tasks/notification/subtasks/responsible-undertaking/organisation-registration-number/organisation-registration-number-form.provider';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { ReviewOrganisationDetails } from 'esos-api';

@Component({
  selector: 'esos-organisation-details',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, OrganisationCompaniesHouseFormComponent],
  templateUrl: './organisation-registration-number.component.html',
  providers: [organisationRegistrationNumberFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationRegistrationNumberComponent {
  protected readonly responsibleUndertakingMap = responsibleUndertakingMap;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly houseCompanyDetailsService: HouseCompanyDetailsService,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    if (this.form.dirty) {
      const formRegistrationNumber = this.form.get('registrationNumber').value;
      const accountOrganisationDetails = this.store.select(notificationQuery.selectAccountOriginatedData)()
        ?.organisationDetails;
      const accountRegistrationNumber = accountOrganisationDetails?.registrationNumber;
      const savedRegistrationNumber = this.store.select(notificationQuery.selectResponsibleUndertaking)()
        ?.organisationDetails?.registrationNumber;

      const organisationDetails = this.form.get('registrationNumberExist').value
        ? formRegistrationNumber === accountRegistrationNumber
          ? formRegistrationNumber === savedRegistrationNumber
            ? of({})
            : of({ ...accountOrganisationDetails })
          : formRegistrationNumber === savedRegistrationNumber
          ? of({})
          : this.houseCompanyDetailsService.getCompanyProfile(formRegistrationNumber).pipe(
              map(
                (details) =>
                  ({
                    name: details?.name,
                    registrationNumber: details?.registrationNumber,
                    ...details?.address,
                  } as ReviewOrganisationDetails),
              ),
            )
        : of({});

      organisationDetails
        .pipe(
          first(),
          map((details) => details),
        )
        .subscribe((details) => this.saveData(details as ReviewOrganisationDetails));
    } else {
      this.saveData({} as ReviewOrganisationDetails);
    }
  }

  private saveData(details: ReviewOrganisationDetails): void {
    this.service.saveSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.REGISTRATION_NUMBER,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.responsibleUndertaking = {
          ...payload.noc.responsibleUndertaking,
          organisationDetails: {
            ...(payload.noc.responsibleUndertaking?.organisationDetails ?? {}),
            ...this.form.value,
            ...(!this.form.get('registrationNumberExist').value ? { registrationNumber: null } : {}),
            ...details,
          },
        };
      }),
    });
  }
}

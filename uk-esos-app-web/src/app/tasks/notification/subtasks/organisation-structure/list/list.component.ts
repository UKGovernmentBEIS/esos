import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { OrganisationStructureListTableComponent } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.component';
import { sortOrganisations } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.helper';
import { OrganisationStructureListTemplateViewModel } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.types';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { AssessmentPersonnelWizardStep } from '@tasks/notification/subtasks/assessment-personnel/assessment-personnel.helper';
import { listFormProvider } from '@tasks/notification/subtasks/organisation-structure/list/list-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { ButtonDirective } from 'govuk-components';

import { OrganisationDetails } from 'esos-api';

import {
  getOrganisationDetails,
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
  OrganisationStructureWizardStep,
} from '../organisation-structure.helper';

@Component({
  selector: 'esos-organisation-structure-list',
  standalone: true,
  imports: [
    ButtonDirective,
    OrganisationStructureListTableComponent,
    PendingButtonDirective,
    RouterLink,
    WizardStepComponent,
    SharedModule,
  ],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [listFormProvider],
})
export class OrganisationStructureListComponent {
  protected readonly wizardStep = AssessmentPersonnelWizardStep;
  protected readonly OrganisationStructureWizardStep = OrganisationStructureWizardStep;

  organisationStructure = this.store.select(notificationQuery.selectOrganisationStructure);
  nocId = this.store.select(requestTaskQuery.selectRequestId)();
  accountId = this.store.select(requestTaskQuery.selectRequestInfo)().accountId;

  vm: Signal<OrganisationStructureListTemplateViewModel> = computed(() => {
    const organisationDetailsRu = this.store.select(notificationQuery.selectResponsibleUndertaking)()
      ?.organisationDetails;
    const organisationDetailsOriginatedData = this.store.select(notificationQuery.selectAccountOriginatedData)()
      .organisationDetails;

    return {
      header: 'Organisations added',
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      isListPreviousPage: true,
      wizardStep: OrganisationStructureWizardStep,
      organisationDetails: getOrganisationDetails(
        organisationDetailsRu,
        organisationDetailsOriginatedData,
      ) as OrganisationDetails,
    };
  });

  queryParams: Params = this.vm().isEditable ? { change: true } : undefined;

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private store: RequestTaskStore,
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
  ) {}

  removeOrganisation(index: number) {
    const organisationsAssociatedWithRU = sortOrganisations(
      this.organisationStructure().organisationsAssociatedWithRU,
    ).filter((_, i) => i !== index - 1);

    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.LIST_REMOVE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = {
          ...payload.noc.organisationStructure,
          organisationsAssociatedWithRU,
        };
      }),
    });
  }

  submit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.LIST,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = { ...payload.noc.organisationStructure, ...this.form.value };
      }),
    });
  }
}

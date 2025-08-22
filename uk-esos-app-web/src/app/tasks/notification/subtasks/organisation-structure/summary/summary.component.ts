import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { sortOrganisations } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.helper';
import {
  OrganisationStructureSummaryPageComponent,
  OrganisationStructureViewModel,
} from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  getOrganisationDetails,
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
  OrganisationStructureWizardStep,
} from '../organisation-structure.helper';

@Component({
  selector: 'esos-organisation-structure-summary',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, OrganisationStructureSummaryPageComponent, PageHeadingComponent, RouterLink],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureSummaryComponent {
  vm: Signal<OrganisationStructureViewModel> = computed(() => {
    const organisationDetailsRu = this.store.select(notificationQuery.selectResponsibleUndertaking)()
      ?.organisationDetails;
    const organisationDetailsOriginatedData = this.store.select(notificationQuery.selectAccountOriginatedData)()
      ?.organisationDetails;

    return {
      subtaskName: ORGANISATION_STRUCTURE_SUB_TASK,
      data: this.store.select(notificationQuery.selectOrganisationStructure)(),
      organisationDetails: getOrganisationDetails(organisationDetailsRu, organisationDetailsOriginatedData),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      sectionsCompleted: this.store.select(notificationQuery.selectNocSectionsCompleted)(),
      wizardStep: OrganisationStructureWizardStep,
    };
  });
  organisationStructure = this.store.select(notificationQuery.selectOrganisationStructure);

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }

  removeOrganisation(index: number) {
    const organisationsAssociatedWithRU = sortOrganisations(
      this.store.select(notificationQuery.selectOrganisationStructure)().organisationsAssociatedWithRU,
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

  removeUndertakingOrganisation(index: number) {
    const organisations = this.store
      .select(notificationQuery.selectOrganisationStructure)()
      .organisationUndertakingDetails.filter((_, i) => i !== index);

    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.LIST_REMOVE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = {
          ...payload.noc.organisationStructure,
          organisationUndertakingDetails: organisations,
        };
      }),
    });
  }
}

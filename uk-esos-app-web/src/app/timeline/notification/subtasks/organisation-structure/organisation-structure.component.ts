import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import {
  OrganisationStructureSummaryPageComponent,
  OrganisationStructureViewModel,
} from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

@Component({
  selector: 'esos-timeline-organisation-structure',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, OrganisationStructureSummaryPageComponent],
  templateUrl: './organisation-structure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrganisationStructureComponent {
  vm: Signal<OrganisationStructureViewModel> = computed(() => {
    const organisationDetailsRu = this.store.select(notificationApplicationTimelineQuery.selectResponsibleUndertaking)()
      ?.organisationDetails;
    const organisationDetailsOriginatedData = this.store.select(
      notificationApplicationTimelineQuery.selectAccountOriginatedData,
    )()?.organisationDetails;

    return {
      data: this.store.select(notificationApplicationTimelineQuery.selectOrganisationStructure)(),
      organisationDetails: organisationDetailsRu?.name ? organisationDetailsRu : organisationDetailsOriginatedData,
      isEditable: false,
    };
  });
  organisationStructure = this.store.select(notificationApplicationTimelineQuery.selectOrganisationStructure);

  constructor(private readonly store: RequestActionStore) {}
}

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { EnergySavingsOpportunitiesSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { EnergySavingsOpportunities } from 'esos-api';

interface ViewModel {
  data: EnergySavingsOpportunities;
  energySavingsOpportunityMap: SubTaskListMap<EnergySavingsOpportunities>;
}

@Component({
  selector: 'esos-timeline-energy-savings-opportunities',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, EnergySavingsOpportunitiesSummaryPageComponent],
  templateUrl: './energy-savings-opportunities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsOpportunitiesComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectEnergySavingsOpportunities)(),
    energySavingsOpportunityMap: energySavingsOpportunityMap,
  }));

  constructor(private readonly store: RequestActionStore) {}
}

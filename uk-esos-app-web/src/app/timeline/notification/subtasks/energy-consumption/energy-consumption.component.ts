import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { EnergyConsumptionSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { EnergyConsumptionDetails } from 'esos-api';

interface ViewModel {
  energyConsumptionDetails: EnergyConsumptionDetails;
}

@Component({
  selector: 'esos-timeline-energy-consumption',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, EnergyConsumptionSummaryPageComponent],
  templateUrl: './energy-consumption.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergyConsumptionComponent {
  vm: Signal<ViewModel> = computed(() => ({
    energyConsumptionDetails: this.store.select(notificationApplicationTimelineQuery.selectEnergyConsumptionDetails)(),
  }));

  constructor(private readonly store: RequestActionStore) {}
}

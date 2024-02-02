import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { CompliancePeriodsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import { FirstCompliancePeriod } from 'esos-api';

interface ViewModel {
  data: FirstCompliancePeriod;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'esos-timeline-first-compliance-period',
  standalone: true,
  imports: [PageHeadingComponent, NgIf, CompliancePeriodsSummaryPageComponent],
  templateUrl: './first-compliance-period.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FirstCompliancePeriodComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationApplicationTimelineQuery.selectFirstCompliancePeriod)(),
    // TODO Should remove the dependency to tasks
    wizardStep: WizardStep,
  }));

  constructor(private readonly store: RequestActionStore) {}
}

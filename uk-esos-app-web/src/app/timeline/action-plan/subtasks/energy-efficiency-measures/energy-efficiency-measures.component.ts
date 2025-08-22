import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE } from '@tasks/action-plan/subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import { actionPlanApplicationTimelineQuery } from '@timeline/action-plan/+state/action-plan-application.selectors';

@Component({
  selector: 'esos-timeline-energy-efficiency-measures',
  standalone: true,
  imports: [PageHeadingComponent, EnergyEfficiencyMeasuresSummaryPageComponent],
  templateUrl: './energy-efficiency-measures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergyEfficiencyMeasuresTimelineComponent {
  readonly title = ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  actionPlanEnergyEfficiencyMeasure = this.store.select(
    actionPlanApplicationTimelineQuery.selectActionPlanEnergyEfficiencyMeasure,
  )();

  constructor(private readonly store: RequestActionStore) {}
}

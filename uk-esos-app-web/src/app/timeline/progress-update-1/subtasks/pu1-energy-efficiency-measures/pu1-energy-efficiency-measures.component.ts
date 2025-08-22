import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';
import { progressUpdate1ApplicationTimelineQuery } from '@timeline/progress-update-1/+state/pu1-application.selectors';

@Component({
  selector: 'esos-pu1-energy-efficiency-measures',
  standalone: true,
  imports: [PageHeadingComponent, ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent],
  templateUrl: './pu1-energy-efficiency-measures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Pu1EnergyEfficiencyMeasuresComponent {
  readonly title = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  readonly measuresForUpdate = this.store.select(progressUpdate1ApplicationTimelineQuery.selectMeasuresForUpdate);
  readonly addedMeasures = this.store.select(progressUpdate1ApplicationTimelineQuery.selectAddedMeasures);
  readonly isDisaggregateUndertaking = this.store.select(
    progressUpdate1ApplicationTimelineQuery.selectIsDisaggregateUndertaking,
  );

  constructor(private readonly store: RequestActionStore) {}
}

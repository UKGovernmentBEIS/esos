import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';
import { progressUpdate2ApplicationTimelineQuery } from '@timeline/progress-update-2/+state/pu2-application.selectors';

@Component({
  selector: 'esos-pu2-energy-efficiency-measures',
  standalone: true,
  imports: [PageHeadingComponent, ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent],
  templateUrl: './pu2-energy-efficiency-measures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Pu2EnergyEfficiencyMeasuresComponent {
  readonly title = PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  readonly measuresForUpdate = this.store.select(progressUpdate2ApplicationTimelineQuery.selectMeasuresForUpdate);
  readonly addedMeasures = this.store.select(progressUpdate2ApplicationTimelineQuery.selectAddedMeasures);
  readonly isDisaggregateUndertaking = this.store.select(
    progressUpdate2ApplicationTimelineQuery.selectIsDisaggregateUndertaking,
  );

  constructor(private readonly store: RequestActionStore) {}
}

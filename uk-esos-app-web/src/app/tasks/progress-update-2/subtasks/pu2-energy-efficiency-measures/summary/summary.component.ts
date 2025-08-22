import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import {
  ProgressUpdate2EnergyEfficiencyMeasuresStep,
  ProgressUpdate2EnergyEfficiencyMeasuresStepUrl,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../pu2-energy-efficiency-measures.helper';

@Component({
  selector: 'esos-pu2-energy-efficiency-measures-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
    ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  measuresForUpdate = this.store.select(progressUpdate2Query.selectMeasuresForUpdate);
  addedMeasures = this.store.select(progressUpdate2Query.selectAddedMeasures);
  isDisaggregateUndertaking = this.store.select(progressUpdate2Query.selectIsDisaggregateUndertaking);

  isSubTaskCompleted =
    this.store.select(progressUpdate2Query.selectProgressUpdate2SectionsCompleted)()[
      PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE
    ] === TaskItemStatus.COMPLETED;
  readonly title = PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  readonly stepUrls = ProgressUpdate2EnergyEfficiencyMeasuresStepUrl;

  constructor(
    private readonly service: TaskService<ProgressUpdate2TaskPayload>,
    private readonly store: RequestTaskStore,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: ProgressUpdate2EnergyEfficiencyMeasuresStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
      applySideEffects: true,
    });
  }
}

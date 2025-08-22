import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries/pu1-energy-efficiency-measures-summary-page/pu1-energy-efficiency-measures-summary-page.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  ProgressUpdate1EnergyEfficiencyMeasuresStepUrl,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../pu1-energy-efficiency-measures.helper';

@Component({
  selector: 'esos-pu1-energy-efficiency-measures-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  measuresForUpdate = this.store.select(progressUpdate1Query.selectMeasuresForUpdate);
  addedMeasures = this.store.select(progressUpdate1Query.selectAddedMeasures);
  isDisaggregateUndertaking = this.store.select(progressUpdate1Query.selectIsDisaggregateUndertaking);

  isSubTaskCompleted =
    this.store.select(progressUpdate1Query.selectProgressUpdate1SectionsCompleted)()[
      PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE
    ] === TaskItemStatus.COMPLETED;
  readonly title = PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  readonly stepUrls = ProgressUpdate1EnergyEfficiencyMeasuresStepUrl;

  constructor(
    private readonly service: TaskService<ProgressUpdate1TaskPayload>,
    private readonly store: RequestTaskStore,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
      applySideEffects: true,
    });
  }
}

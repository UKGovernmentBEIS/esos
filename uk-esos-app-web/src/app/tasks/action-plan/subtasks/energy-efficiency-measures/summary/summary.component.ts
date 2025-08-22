import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { actionPlanQuery } from '@tasks/action-plan/+state/action-plan.selectors';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  EnergyEfficiencyMeasuresStep,
  EnergyEfficiencyMeasuresStepUrl,
} from '../energy-efficiency-measures.helper';

@Component({
  selector: 'esos-energy-efficiency-measures-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    EnergyEfficiencyMeasuresSummaryPageComponent,
    RouterLink,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  actionPlanEnergyEfficiencyMeasure = this.store.select(actionPlanQuery.selectActionPlanEnergyEfficiencyMeasure)();
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  isSubTaskCompleted =
    this.store.select(actionPlanQuery.selectActionPlanSectionsCompleted)()[ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME] ===
    TaskItemStatus.COMPLETED;
  readonly title = ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE;
  readonly stepUrls = EnergyEfficiencyMeasuresStepUrl;

  constructor(
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly store: RequestTaskStore,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit() {
    this.service.submitSubtask({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
      applySideEffects: true,
    });
  }
}

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { EnergySavingsOpportunitiesSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { EnergySavingsOpportunities } from 'esos-api';

import {
  ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
  EnergySavingsOpportunitiesCurrentStep,
  EnergySavingsOpportunitiesWizardStep,
} from '../energy-savings-opportunity.helper';

interface ViewModel {
  data: EnergySavingsOpportunities;
  isEditable: boolean;
  queryParams: Params;
  changeLink: { [s: string]: string };
  isSubTaskCompleted: boolean;
  energySavingsOpportunityMap: SubTaskListMap<EnergySavingsOpportunities>;
}

@Component({
  selector: 'esos-energy-savings-opportunity-summary',
  standalone: true,
  imports: [NgIf, PageHeadingComponent, ButtonDirective, EnergySavingsOpportunitiesSummaryPageComponent],
  templateUrl: './energy-savings-opportunity-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsOpportunitySummaryComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationQuery.selectEnergySavingsOpportunities)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    queryParams: { change: true },
    changeLink: EnergySavingsOpportunitiesWizardStep,
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
    energySavingsOpportunityMap: energySavingsOpportunityMap,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: EnergySavingsOpportunitiesCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

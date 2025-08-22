import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ResponsibleUndertakingSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  RESPONSIBLE_UNDERTAKING_SUB_TASK,
  ResponsibleUndertakingCurrentStep,
  ResponsibleUndertakingWizardStep,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { ResponsibleUndertaking } from 'esos-api';

interface ViewModel {
  responsibleUndertaking: ResponsibleUndertaking;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking>;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'esos-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    NgIf,
    ResponsibleUndertakingSummaryPageComponent,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  vm: Signal<ViewModel> = computed(() => ({
    responsibleUndertaking: this.store.select(notificationQuery.selectResponsibleUndertaking)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[RESPONSIBLE_UNDERTAKING_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
    responsibleUndertakingMap: responsibleUndertakingMap,
    wizardStep: ResponsibleUndertakingWizardStep,
  }));

  constructor(
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly store: RequestTaskStore,
    readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: RESPONSIBLE_UNDERTAKING_SUB_TASK,
      currentStep: ResponsibleUndertakingCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

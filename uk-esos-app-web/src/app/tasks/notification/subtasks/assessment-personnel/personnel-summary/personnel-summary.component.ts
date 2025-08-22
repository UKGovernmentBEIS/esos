import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { PersonnelListTemplateComponent } from '@shared/components/personnel-list-template/personnel-list-template.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import {
  GovukComponentsModule,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective,
} from 'govuk-components';

import { AssessmentPersonnel } from 'esos-api';

import {
  ASSESSMENT_PERSONNEL_SUB_TASK,
  AssessmentPersonnelCurrentStep,
  AssessmentPersonnelWizardStep,
} from '../assessment-personnel.helper';

interface ViewModel {
  data: AssessmentPersonnel;
  isEditable: boolean;
  queryParams: Params;
  prefix: string;
  isSubTaskCompleted: boolean;
}

@Component({
  selector: 'esos-personnel-summary',
  templateUrl: './personnel-summary.component.html',
  standalone: true,
  imports: [
    GovukComponentsModule,
    RouterLink,
    NgIf,
    PageHeadingComponent,
    PersonnelListTemplateComponent,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonnelSummaryComponent {
  protected readonly wizardStep = AssessmentPersonnelWizardStep;

  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationQuery.selectAssessmentPersonnel)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    queryParams: { change: true },
    prefix: '',
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[ASSESSMENT_PERSONNEL_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ASSESSMENT_PERSONNEL_SUB_TASK,
      currentStep: AssessmentPersonnelCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

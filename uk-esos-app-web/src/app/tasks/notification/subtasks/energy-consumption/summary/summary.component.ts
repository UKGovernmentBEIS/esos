import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { EnergyConsumptionSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ENERGY_CONSUMPTION_SUB_TASK,
  EnergyConsumptionCurrentStep,
  EnergyConsumptionWizardStep,
} from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';

import { GovukComponentsModule } from 'govuk-components';

import { EnergyConsumptionDetails } from 'esos-api';

interface ViewModel {
  subtaskName: string;
  energyConsumptionDetails: EnergyConsumptionDetails;
  wizardSteps: { [s: string]: string };
  isEditable: boolean;
  sectionsCompleted: NotificationTaskPayload['nocSectionsCompleted'];
}

@Component({
  selector: 'esos-energy-consumption-summary',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, PageHeadingComponent, EnergyConsumptionSummaryPageComponent],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionSummaryComponent {
  vm: Signal<ViewModel> = computed(() => ({
    subtaskName: ENERGY_CONSUMPTION_SUB_TASK,
    energyConsumptionDetails: this.store.select(notificationQuery.selectEnergyConsumption)(),
    wizardSteps: EnergyConsumptionWizardStep,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    sectionsCompleted: this.store.select(notificationQuery.selectNocSectionsCompleted)(),
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ENERGY_CONSUMPTION_SUB_TASK,
      currentStep: EnergyConsumptionCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}

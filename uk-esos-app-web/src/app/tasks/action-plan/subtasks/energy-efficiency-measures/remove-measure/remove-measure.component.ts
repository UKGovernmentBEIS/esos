import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';

@Component({
  selector: 'esos-remove-measure',
  templateUrl: './remove-measure.component.html',
  standalone: true,
  imports: [GovukComponentsModule, PageHeadingComponent, RouterLink, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveMeasureComponent {
  constructor(
    private readonly service: TaskService<ActionPlanTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onRemove() {
    this.service.saveSubtask({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.REMOVE_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const measureIndex = +this.route.snapshot.paramMap.get('measureIndex');
        const energyEfficiencyMeasures = [...payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures];

        if (energyEfficiencyMeasures.length && energyEfficiencyMeasures[measureIndex]) {
          energyEfficiencyMeasures.splice(measureIndex, 1);
        }

        payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures = energyEfficiencyMeasures;
      }),
      applySideEffects: true,
    });
  }
}

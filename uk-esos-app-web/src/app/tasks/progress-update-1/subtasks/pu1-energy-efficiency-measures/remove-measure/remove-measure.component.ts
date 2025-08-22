import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu1-energy-efficiency-measures.helper';

@Component({
  selector: 'esos-remove-measure',
  templateUrl: './remove-measure.component.html',
  standalone: true,
  imports: [GovukComponentsModule, PageHeadingComponent, RouterLink, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveMeasureComponent {
  constructor(
    private readonly service: TaskService<ProgressUpdate1TaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onRemove() {
    this.service.saveSubtask({
      subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.REMOVE_NEW_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const measureIndex = +this.route.snapshot.paramMap.get('measureIndex');
        const newMeasures = [
          ...payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure,
        ];

        if (newMeasures.length && newMeasures[measureIndex]) {
          newMeasures.splice(measureIndex, 1);
        }

        payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure = newMeasures;
      }),
      applySideEffects: true,
    });
  }
}

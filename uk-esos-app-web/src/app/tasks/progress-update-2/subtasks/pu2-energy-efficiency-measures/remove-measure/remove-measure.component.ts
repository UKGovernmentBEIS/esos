import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import {
  ProgressUpdate2EnergyEfficiencyMeasuresStep,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu2-energy-efficiency-measures.helper';

@Component({
  selector: 'esos-remove-measure',
  templateUrl: './remove-measure.component.html',
  standalone: true,
  imports: [GovukComponentsModule, PageHeadingComponent, RouterLink, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveMeasureComponent {
  constructor(
    private readonly service: TaskService<ProgressUpdate2TaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onRemove() {
    this.service.saveSubtask({
      subtask: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: ProgressUpdate2EnergyEfficiencyMeasuresStep.REMOVE_NEW_MEASURE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const measureIndex = +this.route.snapshot.paramMap.get('measureIndex');
        const newMeasures = [
          ...payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure,
        ];

        if (newMeasures.length && newMeasures[measureIndex]) {
          newMeasures.splice(measureIndex, 1);
        }

        payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure = newMeasures;
      }),
      applySideEffects: true,
    });
  }
}

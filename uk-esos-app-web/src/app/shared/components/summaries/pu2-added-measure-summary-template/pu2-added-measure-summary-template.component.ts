import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { NEW_MEASURE_FORM_CONTENT } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/new-measure/new-measure-content';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate2P3AddedMeasure } from 'esos-api';

@Component({
  selector: 'esos-pu2-added-measure-summary-template',
  standalone: true,
  imports: [EstimationMethodTypePipe, GovukComponentsModule, MeasureSchemePipe],
  templateUrl: './pu2-added-measure-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate2AddedMeasureSummaryTemplateComponent {
  @Input({ required: true }) measure: ProgressUpdate2P3AddedMeasure;

  readonly contentMap = NEW_MEASURE_FORM_CONTENT;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { NEW_MEASURE_FORM_CONTENT } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/new-measure/new-measure-content';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate1P3AddedMeasure } from 'esos-api';

@Component({
  selector: 'esos-pu1-added-measure-summary-template',
  standalone: true,
  imports: [EstimationMethodTypePipe, GovukComponentsModule, MeasureSchemePipe],
  templateUrl: './pu1-added-measure-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1AddedMeasureSummaryTemplateComponent {
  @Input({ required: true }) measure: ProgressUpdate1P3AddedMeasure;

  readonly contentMap = NEW_MEASURE_FORM_CONTENT;
}

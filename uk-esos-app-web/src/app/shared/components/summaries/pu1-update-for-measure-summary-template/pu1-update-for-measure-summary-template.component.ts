import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { isNullOrUndefined } from '@shared/utils';
import { ProgressUpdate1EnergyEfficiencyMeasuresStepUrl } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/update-for-measure/update-for-measure-content';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate1P3EnergyEfficiencyMeasure } from 'esos-api';

@Component({
  selector: 'esos-pu1-update-for-measure-summary-template',
  standalone: true,
  imports: [BooleanToTextPipe, EstimationMethodTypePipe, GovukComponentsModule, NgTemplateOutlet, RouterLink],
  templateUrl: './pu1-update-for-measure-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1UpdateForMeasureSummaryTemplateComponent {
  @Input({ required: true }) updateForMeasure: ProgressUpdate1P3EnergyEfficiencyMeasure;
  @Input() isEditable = false;
  @Input() measureIndex: number;

  readonly contentMap = UPDATE_FOR_MEASURE_FORM_CONTENT;
  readonly stepUrls = ProgressUpdate1EnergyEfficiencyMeasuresStepUrl;

  isNullOrUndefined = isNullOrUndefined;
}

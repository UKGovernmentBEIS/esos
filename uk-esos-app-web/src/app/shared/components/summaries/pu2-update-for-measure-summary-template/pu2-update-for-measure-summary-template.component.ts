import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { isNullOrUndefined } from '@shared/utils';
import { ProgressUpdate2EnergyEfficiencyMeasuresStepUrl } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/update-for-measure/update-for-measure-content';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate2P3EnergyEfficiencyMeasure } from 'esos-api';

@Component({
  selector: 'esos-pu2-update-for-measure-summary-template',
  standalone: true,
  imports: [BooleanToTextPipe, EstimationMethodTypePipe, GovukComponentsModule, NgTemplateOutlet, RouterLink],
  templateUrl: './pu2-update-for-measure-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate2UpdateForMeasureSummaryTemplateComponent {
  @Input({ required: true }) updateForMeasure: ProgressUpdate2P3EnergyEfficiencyMeasure;
  @Input() isEditable = false;
  @Input() measureIndex: number;

  readonly contentMap = UPDATE_FOR_MEASURE_FORM_CONTENT;
  readonly stepUrls = ProgressUpdate2EnergyEfficiencyMeasuresStepUrl;

  isNullOrUndefined = isNullOrUndefined;
}

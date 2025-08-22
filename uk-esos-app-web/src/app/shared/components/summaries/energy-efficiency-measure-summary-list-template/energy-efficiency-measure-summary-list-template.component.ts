import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { MEASURE_FORM_CONTENT } from '@tasks/action-plan/subtasks/energy-efficiency-measures/measure/measure-content';

import { SummaryListRowDirective, SummaryListRowKeyDirective, SummaryListRowValueDirective } from 'govuk-components';

import { EnergyEfficiencyMeasure } from 'esos-api';

@Component({
  selector: 'esos-energy-efficiency-measure-summary-list-template',
  standalone: true,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BooleanToTextPipe,
    EstimationMethodTypePipe,
    MeasureSchemePipe,
    DatePipe,
  ],
  templateUrl: './energy-efficiency-measure-summary-list-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyEfficiencyMeasureSummaryListTemplateComponent {
  @Input({ required: true }) data: EnergyEfficiencyMeasure;

  readonly contentMap = MEASURE_FORM_CONTENT;
}

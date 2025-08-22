import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressUpdate1EnergyEfficiencyMeasuresStepUrl } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate1P3AddedMeasure, ProgressUpdate1P3UpdatedMeasure } from 'esos-api';

import { EnergyEfficiencyMeasureSummaryListTemplateComponent } from '../energy-efficiency-measure-summary-list-template/energy-efficiency-measure-summary-list-template.component';
import { ProgressUpdate1AddedMeasureSummaryTemplateComponent } from '../pu1-added-measure-summary-template/pu1-added-measure-summary-template.component';
import { ProgressUpdate1UpdateForMeasureSummaryTemplateComponent } from '../pu1-update-for-measure-summary-template/pu1-update-for-measure-summary-template.component';

@Component({
  selector: 'esos-pu1-energy-efficiency-measures-summary-page',
  standalone: true,
  imports: [
    RouterLink,
    GovukComponentsModule,
    EnergyEfficiencyMeasureSummaryListTemplateComponent,
    ProgressUpdate1AddedMeasureSummaryTemplateComponent,
    ProgressUpdate1UpdateForMeasureSummaryTemplateComponent,
  ],
  templateUrl: './pu1-energy-efficiency-measures-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent {
  @Input() measuresForUpdate: ProgressUpdate1P3UpdatedMeasure[];
  @Input() addedMeasures: ProgressUpdate1P3AddedMeasure[];
  @Input() isEditable = false;
  @Input({ required: true }) isDisaggregateUndertaking: boolean;

  readonly stepUrls = ProgressUpdate1EnergyEfficiencyMeasuresStepUrl;
}

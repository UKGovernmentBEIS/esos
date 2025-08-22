import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressUpdate2EnergyEfficiencyMeasuresStepUrl } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';

import { GovukComponentsModule } from 'govuk-components';

import {
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import { EnergyEfficiencyMeasureSummaryListTemplateComponent } from '../energy-efficiency-measure-summary-list-template/energy-efficiency-measure-summary-list-template.component';
import { ProgressUpdate1AddedMeasureSummaryTemplateComponent } from '../pu1-added-measure-summary-template/pu1-added-measure-summary-template.component';
import { ProgressUpdate1UpdateForMeasureSummaryTemplateComponent } from '../pu1-update-for-measure-summary-template/pu1-update-for-measure-summary-template.component';
import { ProgressUpdate2AddedMeasureSummaryTemplateComponent } from '../pu2-added-measure-summary-template/pu2-added-measure-summary-template.component';
import { ProgressUpdate2UpdateForMeasureSummaryTemplateComponent } from '../pu2-update-for-measure-summary-template/pu2-update-for-measure-summary-template.component';

@Component({
  selector: 'esos-pu2-energy-efficiency-measures-summary-page',
  standalone: true,
  imports: [
    RouterLink,
    GovukComponentsModule,
    EnergyEfficiencyMeasureSummaryListTemplateComponent,
    ProgressUpdate1AddedMeasureSummaryTemplateComponent,
    ProgressUpdate1UpdateForMeasureSummaryTemplateComponent,
    ProgressUpdate2AddedMeasureSummaryTemplateComponent,
    ProgressUpdate2UpdateForMeasureSummaryTemplateComponent,
  ],
  templateUrl: './pu2-energy-efficiency-measures-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent {
  @Input() measuresForUpdate: (ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure)[];
  @Input() addedMeasures: ProgressUpdate2P3AddedMeasure[];
  @Input() isEditable = false;
  @Input({ required: true }) isDisaggregateUndertaking: boolean;

  readonly stepUrls = ProgressUpdate2EnergyEfficiencyMeasuresStepUrl;
}

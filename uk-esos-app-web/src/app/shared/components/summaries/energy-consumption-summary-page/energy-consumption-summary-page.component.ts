import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EnergyConsumptionDetailsSummaryTemplateComponent } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
} from 'govuk-components';

import { EnergyConsumptionDetails } from 'esos-api';

import { EnergyIntensityRatioTableSummaryTemplateComponent } from '../energy-intensity-ratio-table-summary-template/energy-intensity-ratio-table-summary-template.component';

@Component({
  selector: 'esos-energy-consumption-summary-page',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    NgIf,
    BooleanToTextPipe,
    RouterLink,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    EnergyIntensityRatioTableSummaryTemplateComponent,
    LinkDirective,
  ],
  templateUrl: './energy-consumption-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionSummaryPageComponent {
  @Input() energyConsumptionDetails: EnergyConsumptionDetails;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}

import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
  TableComponent,
} from 'govuk-components';

import { EnergyIntensityRatioDetails } from 'esos-api';

@Component({
  selector: 'esos-energy-intensity-ratio-table-summary-template',
  templateUrl: './energy-intensity-ratio-table-summary-template.component.html',
  standalone: true,
  styles: [
    `
      .additional-info-bottom-margin {
        margin-bottom: 1em !important;
      }
    `,
  ],
  imports: [
    RouterLink,
    LinkDirective,
    TableComponent,
    ButtonDirective,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyIntensityRatioTableSummaryTemplateComponent {
  @Input() energyIntensityRatioDetails: EnergyIntensityRatioDetails;
  @Input() isEditable = false;
  @Input() changeLink: string;
  @Input() queryParams: Params = {};

  protected readonly columns: GovukTableColumn[] = [
    { header: 'Energy intensity ratio', field: 'ratio' },
    { header: 'Indicator of activity', field: 'unit' },
    { header: '', field: 'changeLink' },
  ];
}

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { EnergyConsumption, SignificantEnergyConsumption } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-details-summary-template',
  templateUrl: './energy-consumption-details-summary-template.component.html',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NgIf,
    RouterLink,
    LinkDirective,
    NoDataEnteredPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionDetailsSummaryTemplateComponent {
  @Input() energyConsumption: EnergyConsumption & {
    significantEnergyConsumptionPct?: SignificantEnergyConsumption['significantEnergyConsumptionPct'];
  };
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  protected isValidEnergyConsumption(value: any): boolean {
    return value != null && value !== '';
  }
}

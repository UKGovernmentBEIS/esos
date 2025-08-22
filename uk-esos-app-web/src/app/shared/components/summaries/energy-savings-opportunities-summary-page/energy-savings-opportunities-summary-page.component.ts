import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

import { TotalEnergyConsumptionReductionSummaryTemplateComponent } from '@shared/components/summaries';
import { EnergyConsumptionDetailsWithCostSummaryTemplateComponent } from '@shared/components/summaries';
import { EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent } from '@shared/components/summaries';
import { SubTaskListMap } from '@shared/types';

import { EnergySavingsOpportunities } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-opportunities-summary-page',
  standalone: true,
  imports: [
    EnergyConsumptionDetailsWithCostSummaryTemplateComponent,
    EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent,
    TotalEnergyConsumptionReductionSummaryTemplateComponent,
    NgIf,
  ],
  templateUrl: './energy-savings-opportunities-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsOpportunitiesSummaryPageComponent {
  @Input() data: EnergySavingsOpportunities;
  @Input() energySavingsOpportunityMap: SubTaskListMap<EnergySavingsOpportunities>;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}

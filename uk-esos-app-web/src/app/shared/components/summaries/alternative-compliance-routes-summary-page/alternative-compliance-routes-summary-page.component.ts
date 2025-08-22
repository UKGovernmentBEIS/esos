import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  AssetsSummaryTemplateComponent,
  CertificateDetailsListSummaryTemplateComponent,
  CertificateDetailsSummaryTemplateComponent,
  TotalEnergyConsumptionReductionSummaryTemplateComponent,
} from '@shared/components/summaries';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';

import { ButtonDirective, GovukTableColumn } from 'govuk-components';

import { AlternativeComplianceRoutes } from 'esos-api';

import { EnergyConsumptionDetailsWithCostSummaryTemplateComponent } from '../energy-consumption-details-with-cost-summary-template/energy-consumption-details-with-cost-summary-template.component';
import { EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent } from '../energy-savings-categories-details-with-cost-summary-template/energy-savings-categories-details-with-cost-summary-template.component';

@Component({
  selector: 'esos-alternative-compliance-routes-summary-page',
  standalone: true,
  imports: [
    NgIf,
    AssetsSummaryTemplateComponent,
    CertificateDetailsListSummaryTemplateComponent,
    CertificateDetailsSummaryTemplateComponent,
    EnergyConsumptionDetailsWithCostSummaryTemplateComponent,
    EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent,
    TotalEnergyConsumptionReductionSummaryTemplateComponent,
    ButtonDirective,
    RouterLink,
  ],
  templateUrl: './alternative-compliance-routes-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlternativeComplianceRoutesSummaryPageComponent {
  @Input() data: AlternativeComplianceRoutes;
  @Input() alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes>;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};

  decColumns: GovukTableColumn[] = [
    { field: 'certificateNumber', header: 'Certificate number', widthClass: 'govuk-!-width-one-third' },
    { field: 'validFrom', header: 'Valid from' },
    { field: 'validUntil', header: 'Valid until' },
    { field: 'change', header: '' },
  ];

  gdaColumns: GovukTableColumn[] = [
    { field: 'certificateNumber', header: 'Report reference number', widthClass: 'govuk-!-width-one-third' },
    { field: 'validFrom', header: 'Valid from' },
    { field: 'validUntil', header: 'Valid until' },
    { field: 'change', header: '' },
  ];
}

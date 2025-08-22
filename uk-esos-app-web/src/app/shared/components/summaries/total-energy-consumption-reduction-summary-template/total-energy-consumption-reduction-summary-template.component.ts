import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';

import { GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

import { TotalEnergyConsumptionReduction } from 'esos-api';

interface DataViewModel {
  name: string;
  energy: number;
  cost: string;
  changeLink: string;
}

@Component({
  selector: 'esos-total-energy-consumption-reduction-summary-template',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TableComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    LinkDirective,
    NoDataEnteredPipe,
    NoDataEnteredForCostPipe,
  ],
  templateUrl: './total-energy-consumption-reduction-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalEnergyConsumptionReductionSummaryTemplateComponent implements OnInit {
  @Input() totalEnergyConsumptionReduction: TotalEnergyConsumptionReduction;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() name: string = 'Total annual reduction';

  protected data: DataViewModel[] = [];

  protected readonly columns: GovukTableColumn[] = [
    { header: '', field: 'name', widthClass: 'govuk-!-width-one-half' },
    { header: 'kWh', field: 'energy', widthClass: 'govuk-!-text-align-right' },
    { header: '£', field: 'cost', widthClass: 'govuk-!-text-align-right' },
    { header: '', field: 'changeLink' },
  ];

  ngOnInit(): void {
    this.data = [
      {
        name: this.name,
        energy: this.totalEnergyConsumptionReduction.energyConsumption,
        cost: this.totalEnergyConsumptionReduction.energyCost,
        changeLink: this.changeLink,
      },
    ];
  }
}

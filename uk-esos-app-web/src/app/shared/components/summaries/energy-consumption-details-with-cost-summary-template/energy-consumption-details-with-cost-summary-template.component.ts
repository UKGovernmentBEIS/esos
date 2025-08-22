import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';

import { GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

import { EnergyConsumptionPotentialReduction } from 'esos-api';

interface DataViewModel {
  name: string;
  energy: number;
  cost: string;
  changeLink: string;
}

@Component({
  selector: 'esos-energy-consumption-details-with-cost-summary-template',
  templateUrl: './energy-consumption-details-with-cost-summary-template.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    LinkDirective,
    TableComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NoDataEnteredPipe,
    NoDataEnteredForCostPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionDetailsWithCostSummaryTemplateComponent implements OnInit {
  @Input() energyConsumption: EnergyConsumptionPotentialReduction;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  data: DataViewModel[] = [];

  protected readonly columns: GovukTableColumn[] = [
    { header: '', field: 'name', widthClass: 'govuk-!-width-one-half' },
    { header: 'kWh', field: 'energy', widthClass: 'govuk-!-text-align-right' },
    { header: '£', field: 'cost', widthClass: 'govuk-!-text-align-right' },
    { header: '', field: 'changeLink' },
  ];

  ngOnInit(): void {
    this.data = [
      {
        name: 'Buildings',
        energy: this.energyConsumption.buildings.energyConsumption,
        cost: this.energyConsumption.buildings.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Transport',
        energy: this.energyConsumption.transport.energyConsumption,
        cost: this.energyConsumption.transport.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Industrial processes',
        energy: this.energyConsumption.industrialProcesses.energyConsumption,
        cost: this.energyConsumption.industrialProcesses.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Other energy uses',
        energy: this.energyConsumption.otherProcesses.energyConsumption,
        cost: this.energyConsumption.otherProcesses.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Total',
        energy: this.energyConsumption.energyConsumptionTotal,
        cost: this.energyConsumption.energyCostTotal,
        changeLink: null,
      },
    ];
  }
}

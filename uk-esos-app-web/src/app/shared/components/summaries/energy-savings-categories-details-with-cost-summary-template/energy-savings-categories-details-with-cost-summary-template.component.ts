import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';

import { GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

import { EnergySavingsCategoriesPotentialReduction } from 'esos-api';

interface DataViewModel {
  name: string;
  energy: number;
  cost: string;
  changeLink: string;
}

@Component({
  selector: 'esos-energy-savings-categories-details-with-cost-summary-template',
  templateUrl: './energy-savings-categories-details-with-cost-summary-template.component.html',
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
export class EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent implements OnInit {
  @Input() energySavingsCategories: EnergySavingsCategoriesPotentialReduction;
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
        name: 'Energy management practices',
        energy: this.energySavingsCategories.energyManagementPractices.energyConsumption,
        cost: this.energySavingsCategories.energyManagementPractices.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Behaviour change interventions',
        energy: this.energySavingsCategories.behaviourChangeInterventions.energyConsumption,
        cost: this.energySavingsCategories.behaviourChangeInterventions.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Training',
        energy: this.energySavingsCategories.training.energyConsumption,
        cost: this.energySavingsCategories.training.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Controls improvements',
        energy: this.energySavingsCategories.controlsImprovements.energyConsumption,
        cost: this.energySavingsCategories.controlsImprovements.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Capital investments',
        energy: this.energySavingsCategories.capitalInvestments.energyConsumption,
        cost: this.energySavingsCategories.capitalInvestments.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Other measures not covered by one of the above',
        energy: this.energySavingsCategories.otherMeasures.energyConsumption,
        cost: this.energySavingsCategories.otherMeasures.energyCost,
        changeLink: this.changeLink,
      },
      {
        name: 'Total',
        energy: this.energySavingsCategories.energyConsumptionTotal,
        cost: this.energySavingsCategories.energyCostTotal,
        changeLink: null,
      },
    ];
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@testing';

import { EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent } from './energy-savings-categories-details-with-cost-summary-template.component';

describe('EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent', () => {
  let component: EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent> {
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent],
    });

    fixture = TestBed.createComponent(EnergySavingsCategoriesDetailsWithCostSummaryTemplateComponent);
    component = fixture.componentInstance;

    component.changeLink = 'step-1';

    component.energySavingsCategories = {
      energyManagementPractices: { energyConsumption: 1, energyCost: '1.00' },
      behaviourChangeInterventions: { energyConsumption: 2, energyCost: '2.20' },
      training: { energyConsumption: 3, energyCost: '3.03' },
      controlsImprovements: { energyConsumption: 4, energyCost: '0.00' },
      capitalInvestments: { energyConsumption: 6, energyCost: '0.00' },
      otherMeasures: { energyConsumption: 7, energyCost: '0.00' },
      energyConsumptionTotal: 28,
      energyCostTotal: '6.23',
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the table with added persons', () => {
    expect(page.tableCells).toEqual([
      '',
      'kWh',
      '£',
      '',
      'Energy management practices',
      '1',
      '1.00',
      '',
      'Behaviour change interventions',
      '2',
      '2.20',
      '',
      'Training',
      '3',
      '3.03',
      '',
      'Controls improvements',
      '4',
      '0.00',
      '',
      'Capital investments',
      '6',
      '0.00',
      '',
      'Other measures not covered by one of the above',
      '7',
      '0.00',
      '',
      'Total',
      '28',
      '6.23',
      '',
    ]);
  });
});

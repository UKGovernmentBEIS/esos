import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@testing';

import { EnergyConsumptionDetailsWithCostSummaryTemplateComponent } from './energy-consumption-details-with-cost-summary-template.component';

describe('EnergyConsumptionDetailsWithCostSummaryTemplateComponent', () => {
  let component: EnergyConsumptionDetailsWithCostSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergyConsumptionDetailsWithCostSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EnergyConsumptionDetailsWithCostSummaryTemplateComponent> {
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergyConsumptionDetailsWithCostSummaryTemplateComponent],
    });

    fixture = TestBed.createComponent(EnergyConsumptionDetailsWithCostSummaryTemplateComponent);
    component = fixture.componentInstance;

    component.changeLink = 'step-1';

    component.energyConsumption = {
      buildings: { energyConsumption: 2, energyCost: '0.00' },
      transport: { energyConsumption: 4, energyCost: '2.00' },
      industrialProcesses: { energyConsumption: 9, energyCost: '4.45' },
      otherProcesses: { energyConsumption: 13, energyCost: '110.60' },
      energyConsumptionTotal: 28,
      energyCostTotal: '117.05',
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
      'Buildings',
      '2',
      '0.00',
      '',
      'Transport',
      '4',
      '2.00',
      '',
      'Industrial processes',
      '9',
      '4.45',
      '',
      'Other energy uses',
      '13',
      '110.60',
      '',
      'Total',
      '28',
      '117.05',
      '',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySavingsOpportunitiesSummaryPageComponent } from '@shared/components/summaries';
import { energySavingsOpportunityMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { BasePage } from '@testing';

describe('EnergySavingsOpportunitiesSummaryPageComponent', () => {
  let component: EnergySavingsOpportunitiesSummaryPageComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitiesSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<EnergySavingsOpportunitiesSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }

    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsOpportunitiesSummaryPageComponent],
    });

    fixture = TestBed.createComponent(EnergySavingsOpportunitiesSummaryPageComponent);
    component = fixture.componentInstance;

    component.changeLink = {
      STEP1: 'step-1',
      STEP2: 'step-2',
    };

    component.data = {
      energyConsumption: {
        buildings: { energyConsumption: 2, energyCost: '0.00' },
        transport: { energyConsumption: 4, energyCost: '2.00' },
        industrialProcesses: { energyConsumption: 9, energyCost: '4.45' },
        otherProcesses: { energyConsumption: 13, energyCost: '110.60' },
        energyConsumptionTotal: 28,
        energyCostTotal: '117.05',
      },
      energySavingsCategories: {
        energyManagementPractices: { energyConsumption: 1, energyCost: '1.00' },
        behaviourChangeInterventions: { energyConsumption: 2, energyCost: '2.20' },
        training: { energyConsumption: 3, energyCost: '3.03' },
        controlsImprovements: { energyConsumption: 4, energyCost: '4.00' },
        capitalInvestments: { energyConsumption: 6, energyCost: '4.00' },
        otherMeasures: { energyConsumption: 7, energyCost: '4.00' },
        energyConsumptionTotal: 28,
        energyCostTotal: '6.23',
      },
    };

    component.energySavingsOpportunityMap = energySavingsOpportunityMap;

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      `Total annual reduction in energy consumption and energy spend by organisational purpose`,
      `Total annual reduction in energy consumption and energy spend by energy saving category`,
    ]);
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
      '4.00',
      '',
      'Capital investments',
      '6',
      '4.00',
      '',
      'Other measures not covered by one of the above',
      '7',
      '4.00',
      '',
      'Total',
      '28',
      '6.23',
      '',
    ]);
  });
});

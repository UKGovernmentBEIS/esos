import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EnergyConsumptionSummaryPageComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('EnergyConsumptionSummaryPageComponent', () => {
  let component: EnergyConsumptionSummaryPageComponent;
  let fixture: ComponentFixture<EnergyConsumptionSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergyConsumptionSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }

    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergyConsumptionSummaryPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergyConsumptionSummaryPageComponent);
    component = fixture.componentInstance;

    component.changeLink = {
      TOTAL_ENERGY: 'link',
    };
    component.energyConsumptionDetails = {
      totalEnergyConsumption: {
        buildings: 100,
        transport: 0,
        industrialProcesses: 50,
        otherProcesses: 0,
        total: 150,
      },
      significantEnergyConsumptionExists: true,
      significantEnergyConsumption: {
        buildings: 100,
        transport: 0,
        industrialProcesses: 45,
        otherProcesses: 0,
        total: 145,
        significantEnergyConsumptionPct: 97,
      },
      energyIntensityRatioData: {
        buildings: {
          energyIntensityRatios: [{ ratio: '50', unit: 'm2' }],
          additionalInformation: 'Buildings additional information',
        },
        transport: {
          energyIntensityRatios: [{ ratio: '60', unit: 'm2' }],
          additionalInformation: 'Transport additional information',
        },
        industrialProcesses: {
          energyIntensityRatios: [{ ratio: '70', unit: 'm2' }],
          additionalInformation: 'Industrial processes additional information',
        },
        otherProcesses: {
          energyIntensityRatios: [{ ratio: '80', unit: 'm2' }],
          additionalInformation: 'Other processes additional information',
        },
      },
      additionalInformationExists: true,
      additionalInformation: 'Additional info',
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      'What is the total energy consumption in kWh for the reference period?',
      'Have you used significant energy consumption?',
      'What is the significant energy consumption in kWh for the reference period?',
      'Energy intensity ratios for your significant energy consumption',
      'Buildings',
      'Industrial Processes',
      'Do you want to add more information to give context to the energy intensity ratio?',
    ]);
  });

  it('should display the table with added data', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '100 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '50 kWh'],
      ['Other energy uses', '0 kWh'],
      ['Total', '150 kWh'],
      ['Buildings', '100 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '45 kWh'],
      ['Other energy uses', '0 kWh'],
      ['Total', '145 kWh  (97% of total energy consumption)'],
      ['Additional Information', 'Buildings additional information'],
      ['Additional Information', 'Industrial processes additional information'],
    ]);
  });
});

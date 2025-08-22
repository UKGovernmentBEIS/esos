import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeComplianceRoutesSummaryPageComponent } from '@shared/components/summaries';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { BasePage } from '@testing';

describe('AlternativeComplianceRoutesSummaryPageComponent', () => {
  let component: AlternativeComplianceRoutesSummaryPageComponent;
  let fixture: ComponentFixture<AlternativeComplianceRoutesSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<AlternativeComplianceRoutesSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlternativeComplianceRoutesSummaryPageComponent],
    });

    fixture = TestBed.createComponent(AlternativeComplianceRoutesSummaryPageComponent);
    component = fixture.componentInstance;

    component.alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
    component.data = {
      totalEnergyConsumptionReduction: { energyConsumption: 12, energyCost: '0' },
      energyConsumptionReduction: {
        buildings: { energyConsumption: 2, energyCost: '0.00' },
        transport: { energyConsumption: 4, energyCost: '2.00' },
        industrialProcesses: { energyConsumption: 9, energyCost: '4.45' },
        otherProcesses: { energyConsumption: 13, energyCost: '110.60' },
        energyConsumptionTotal: 28,
        energyCostTotal: '117.05',
      },
      energyConsumptionReductionCategories: {
        energyManagementPractices: { energyConsumption: 1, energyCost: '1.00' },
        behaviourChangeInterventions: { energyConsumption: 2, energyCost: '2.20' },
        training: { energyConsumption: 3, energyCost: '3.03' },
        controlsImprovements: { energyConsumption: 4, energyCost: '0.00' },
        capitalInvestments: { energyConsumption: 6, energyCost: '0.00' },
        otherMeasures: { energyConsumption: 7, energyCost: '0.00' },
        energyConsumptionTotal: 28,
        energyCostTotal: '6.23',
      },
      assets: {
        iso50001: 'iso1',
        dec: 'dec1',
        gda: 'gda1',
      },
      iso50001CertificateDetails: {
        certificateNumber: 'iso1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      decCertificatesDetails: {
        certificateDetails: [
          {
            certificateNumber: 'dec1',
            validFrom: '2022-01-01T00:00:00.000Z',
            validUntil: '2024-01-01T00:00:00.000Z',
          },
          {
            certificateNumber: 'dec2',
            validFrom: '2020-01-01T00:00:00.000Z',
            validUntil: '2021-01-01T00:00:00.000Z',
          },
        ],
      },
      gdaCertificatesDetails: {
        certificateDetails: [
          {
            certificateNumber: 'gda1',
            validFrom: '2022-01-01T00:00:00.000Z',
            validUntil: '2024-01-01T00:00:00.000Z',
          },
          {
            certificateNumber: 'gda2',
            validFrom: '2020-01-01T00:00:00.000Z',
            validUntil: '2021-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      'Total annual reduction in energy consumption and energy spend from implementing energy saving measures',
      'Total annual reduction in energy consumption and energy spend by organisational purpose',
      'Total annual reduction in energy consumption and energy spend by energy saving category',
      'List your assets and activities that fall under each alternative compliance route',
      'Provide details of your ISO 50001 certificate (optional)',
      'Provide details about your Display Energy Certificate (DECs) (optional)',
      'Provide details of your Green Deal Assessment (optional)',
    ]);
  });

  it('should display the table with added persons', () => {
    expect(page.tableCells).toEqual([
      '',
      'kWh',
      '£',
      '',
      'Total annual reduction',
      '12',
      '0',
      '',
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
      'Certificate number',
      'Valid from',
      'Valid until',
      '',
      'dec1',
      '1 Jan 2022',
      '1 Jan 2024',
      '',
      'dec2',
      '1 Jan 2020',
      '1 Jan 2021',
      '',
      'Report reference number',
      'Valid from',
      'Valid until',
      '',
      'gda1',
      '1 Jan 2022',
      '1 Jan 2024',
      '',
      'gda2',
      '1 Jan 2020',
      '1 Jan 2021',
      '',
    ]);
  });
});

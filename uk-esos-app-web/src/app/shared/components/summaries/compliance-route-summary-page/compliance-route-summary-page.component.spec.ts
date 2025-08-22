import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ComplianceRouteSummaryPageComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

import { ComplianceRoute } from 'esos-api';

describe('ComplianceRouteSummaryPageComponent', () => {
  let component: ComplianceRouteSummaryPageComponent;
  let fixture: ComponentFixture<ComplianceRouteSummaryPageComponent>;
  let page: Page;

  const complianceRoute = {
    estimatedCalculationTypes: ['TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION'],
    areTwelveMonthsVerifiableDataUsed: false,
    twelveMonthsVerifiableDataUsedReason: 'reason1',
    areEstimationMethodsRecorded: 'YES',
    energyConsumptionProfilingUsed: 'NO',
    isEnergyConsumptionProfilingNotUsedRecorded: 'SKIP_QUESTION',
    partsProhibitedFromDisclosingExist: false,
  } as ComplianceRoute;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ComplianceRouteSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
    get headings() {
      return this.queryAll<HTMLHeadingElement>('h2').map((header) => header.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });
    fixture = TestBed.createComponent(ComplianceRouteSummaryPageComponent);
    component = fixture.componentInstance;
    component.vm = {
      subtaskName: 'complianceRoute',
      data: complianceRoute,
      isEditable: false,
      sectionsCompleted: { complianceRoute: 'COMPLETED' },
      wizardStep: {},
    };
    component.complianceRoute = signal(complianceRoute);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display only the appropriate summary details according to the data', () => {
    expect(page.headings).toEqual([
      'Did you use any estimates in relation to the following calculations (as applicable)?',
      'Did all your energy audits use 12 months of verifiable data?',
      'Are the methods used for estimated data recorded in the evidence pack?',
      'Did this organisation use energy consumption profiling for the purpose of analysing its energy consumption for all ESOS energy audits?',
      'Does the evidence pack record the extent to which, and the reasons why, energy consumption profiling was not used in the energy audit and the details of the alternative method of analysis used?',
      'Are there any parts of the ESOS report, or supporting information, that the responsible undertaking is prohibited from disclosing to any group undertaking?',
    ]);

    expect(page.summaries).toEqual([
      'The total energy consumption or, as applicable, significant energy consumption, over the reference period.',
      'Yes',
      'The conversion of total energy consumption or, as applicable, significant energy consumption into kWh, where it was not measured in those units.',
      'No',
      'The amount of total energy consumption or, as applicable, significant energy consumption attributable to each organisational purpose in kWh.',
      'No',
      'The energy consumption over the 12-month period covered by any energy audit.',
      'No',
      'No',
      'Provide details of the extent to which and reasons why your energy audits did not use 12 months of verifiable data',
      'reason1',
      'Yes',
      'No',
      'Skip question',
      'No',
    ]);
  });
});

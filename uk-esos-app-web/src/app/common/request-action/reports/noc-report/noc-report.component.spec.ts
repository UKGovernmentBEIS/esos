import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { mockRequestActionNocP3SubmittedState } from '@common/request-action/testing/mock-data';
import { RequestActionReportService } from '@shared/services/request-action-report.service';
import { ActivatedRouteStub, BasePage, mockClass } from '@testing';

import { NocReportComponent } from './noc-report.component';

describe('NocReportComponent', () => {
  let component: NocReportComponent;
  let fixture: ComponentFixture<NocReportComponent>;
  let page: Page;
  let store: RequestActionStore;

  const requestActionReportService = mockClass(RequestActionReportService);

  class Page extends BasePage<NocReportComponent> {
    get reportingObligationSummaryPage() {
      return this.query<HTMLElement>('esos-reporting-obligation-summary-page');
    }

    get responsibleUndertakingSummaryPage() {
      return this.query<HTMLElement>('esos-responsible-undertaking-summary-page');
    }

    get contactPersonsSummaryPage() {
      return this.query<HTMLElement>('esos-contact-persons-summary-page');
    }

    get organisationStructureSummaryPage() {
      return this.query<HTMLElement>('esos-organisation-structure-summary-page');
    }

    get complianceRouteSummaryPage() {
      return this.query<HTMLElement>('esos-compliance-route-summary-page');
    }

    get energyConsumptionSummaryPage() {
      return this.query<HTMLElement>('esos-energy-consumption-summary-page');
    }

    get energySavingsOpportunitiesSummaryPage() {
      return this.query<HTMLElement>('esos-energy-savings-opportunities-summary-page');
    }

    get alternativeComplianceRoutesSummaryPage() {
      return this.query<HTMLElement>('esos-alternative-compliance-routes-summary-page');
    }

    get energySavingsAchievedSummaryPage() {
      return this.query<HTMLElement>('esos-energy-savings-achieved-summary-page');
    }

    get leadAssessorDetailsSummaryPage() {
      return this.query<HTMLElement>('esos-lead-assessor-details-summary-page');
    }

    get personnelListTemplate() {
      return this.query<HTMLElement>('esos-personnel-list-template');
    }

    get compliancePeriodsSummaryPage() {
      return this.queryAll<HTMLElement>('esos-compliance-periods-summary-page');
    }

    get confirmationSummaryPage() {
      return this.query<HTMLElement>('esos-confirmation-summary-page');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionNocP3SubmittedState);

    fixture = TestBed.createComponent(NocReportComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.reportingObligationSummaryPage).toBeTruthy();
    expect(page.responsibleUndertakingSummaryPage).toBeTruthy();
    expect(page.contactPersonsSummaryPage).toBeTruthy();
    expect(page.organisationStructureSummaryPage).toBeTruthy();
    expect(page.complianceRouteSummaryPage).toBeTruthy();
    expect(page.energyConsumptionSummaryPage).toBeTruthy();
    expect(page.energySavingsOpportunitiesSummaryPage).toBeTruthy();
    expect(page.alternativeComplianceRoutesSummaryPage).toBeTruthy();
    expect(page.energySavingsAchievedSummaryPage).toBeTruthy();
    expect(page.leadAssessorDetailsSummaryPage).toBeTruthy();
    expect(page.personnelListTemplate).toBeTruthy();
    expect(page.compliancePeriodsSummaryPage).toHaveLength(2);
    expect(page.confirmationSummaryPage).toBeTruthy();
  });

  it('should invoke print upon load', () => {
    setTimeout(() => {
      expect(component).toBeTruthy();
      expect(requestActionReportService.print).toHaveBeenCalledTimes(1);
    }, 1000);
  });
});

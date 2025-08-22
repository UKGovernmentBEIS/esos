import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import ReportingObligationComponent from '@timeline/notification/subtasks/reporting-obligation/reporting-obligation.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('ReportingObligationComponent', () => {
  let component: ReportingObligationComponent;
  let fixture: ComponentFixture<ReportingObligationComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<ReportingObligationComponent> {
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
      providers: [RequestActionStore],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(ReportingObligationComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      [
        'Does your organisation qualify for ESOS?',
        'Yes, the organisation qualifies for ESOS and will submit a notification',
      ],
      [
        'Select the reason that your organisation, or another organisation in its corporate group, qualifies for ESOS',
        '',
      ],
      [
        'Are the organisations in this notification responsible for any energy under ESOS?',
        'Yes, the organisation is responsible for energy',
      ],
      ['ISO 50001', ''],
      ['Display Energy Certificate (DECs)', ''],
      ['Green Deal Assessment', ''],
      ['Energy audits that are compliant with ESOS', ''],
      ['Energy use not covered by any compliance route', ''],
      ['Total', ''],
    ]);
  });
});

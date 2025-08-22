import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { ActivatedRouteStub, BasePage } from '@testing';
import FirstCompliancePeriodComponent from '@timeline/notification/subtasks/first-compliance-period/first-compliance-period.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('FirstCompliancePeriodComponent', () => {
  let component: FirstCompliancePeriodComponent;
  let fixture: ComponentFixture<FirstCompliancePeriodComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<FirstCompliancePeriodComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }

    get summaryColumnValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__column')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(FirstCompliancePeriodComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '4000 kWh'],
      ['Transport', '2500 kWh'],
      ['Industrial processes', '1500 kWh'],
      ['Other energy uses', '800 kWh'],
      ['Total', '8800 kWh'],
      ['Buildings', '5000 kWh'],
      ['Transport', '3000 kWh'],
      ['Industrial processes', '2000 kWh'],
      ['Other energy uses', '1000 kWh'],
      ['Total', '11000 kWh  (25% of total energy consumption)'],
      ['Buildings', '4000 kWh'],
      ['Transport', '2500 kWh'],
      ['Industrial processes', '1500 kWh'],
      ['Other energy uses', '800 kWh'],
      ['Total', '8800 kWh'],
    ]);
  });

  it('should show summary column values', () => {
    expect(page.summaryColumnValues).toEqual([['Yes'], ['0'], ['Explanation for changes in total consumption']]);
  });
});

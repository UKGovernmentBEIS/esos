import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import EnergySavingsAchievedComponent from '@timeline/notification/subtasks/energy-savings-achieved/energy-savings-achieved.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('EnergySavingsAchievedComponent', () => {
  let component: EnergySavingsAchievedComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<EnergySavingsAchievedComponent> {
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

    fixture = TestBed.createComponent(EnergySavingsAchievedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '0 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '0 kWh'],
      ['Other energy uses', '0 kWh'],
      ['Total', '0 kWh'],
      ['Energy management practices', '0 kWh'],
      ['Behaviour change interventions', '0 kWh'],
      ['Training', '0 kWh'],
      ['Controls improvements', '0 kWh'],
      ['Capital investments', '0 kWh'],
      ['Other measures not covered by one of the above', '0 kWh'],
      ['Total', '0   kWh'],
      ['Energy audits', '0 %'],
      ['Alternative compliance routes', '0 %'],
      ['Other', '0 %'],
      ['Total', '0   %'],
    ]);
  });
});

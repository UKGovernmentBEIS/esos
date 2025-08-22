import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { ActivatedRouteStub, BasePage } from '@testing';
import EnergyConsumptionComponent from '@timeline/notification/subtasks/energy-consumption/energy-consumption.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('EnergyConsumptionComponent', () => {
  let component: EnergyConsumptionComponent;
  let fixture: ComponentFixture<EnergyConsumptionComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergyConsumptionComponent> {
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
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(EnergyConsumptionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
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

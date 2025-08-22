import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import EnergySavingsOpportunitiesComponent from '@timeline/notification/subtasks/energy-savings-opportunities/energy-savings-opportunities.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('EnergySavingsOpportunitiesComponent', () => {
  let component: EnergySavingsOpportunitiesComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitiesComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<EnergySavingsOpportunitiesComponent> {
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
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

    fixture = TestBed.createComponent(EnergySavingsOpportunitiesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
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
    ]);
  });
});

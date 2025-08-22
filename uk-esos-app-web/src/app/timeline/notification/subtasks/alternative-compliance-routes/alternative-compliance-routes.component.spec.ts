import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import AlternativeComplianceRoutesComponent from '@timeline/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('AlternativeComplianceRoutesComponent', () => {
  let component: AlternativeComplianceRoutesComponent;
  let fixture: ComponentFixture<AlternativeComplianceRoutesComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<AlternativeComplianceRoutesComponent> {
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

    fixture = TestBed.createComponent(AlternativeComplianceRoutesComponent);
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
      'Total annual reduction',
      '12',
      '0.00',
      '',
      '',
      'kWh',
      '£',
      '',
      'Buildings',
      '1',
      '0.00',
      '',
      'Transport',
      '5',
      '0.00',
      '',
      'Industrial processes',
      '4',
      '0.00',
      '',
      'Other energy uses',
      '2',
      '0.00',
      '',
      'Total',
      '12',
      '0.00',
      '',
      '',
      'kWh',
      '£',
      '',
      'Energy management practices',
      '1',
      '0.00',
      '',
      'Behaviour change interventions',
      '2',
      '0.00',
      '',
      'Training',
      '3',
      '0.00',
      '',
      'Controls improvements',
      '4',
      '0.00',
      '',
      'Capital investments',
      '0',
      '0.00',
      '',
      'Other measures not covered by one of the above',
      '1',
      '0.00',
      '',
      'Total',
      '12',
      '0.00',
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

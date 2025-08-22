import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { ActivatedRouteStub, BasePage } from '@testing';
import LeadAssessorDetailsComponent from '@timeline/notification/subtasks/lead-assessor-details/lead-assessor-details.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('LeadAssessorDetailsComponent', () => {
  let component: LeadAssessorDetailsComponent;
  let fixture: ComponentFixture<LeadAssessorDetailsComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<LeadAssessorDetailsComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
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

    fixture = TestBed.createComponent(LeadAssessorDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      'External',
      'First name',
      'Mike',
      'Last name',
      'Btiste',
      'Email address',
      'dpg@media.com',
      'Professional body',
      'Association of Energy Engineers',
      'Membership name',
      '13',
      'Yes, the lead assessor reviewed and confirmed that the assessment meets the ESOS requirements',
    ]);
  });
});

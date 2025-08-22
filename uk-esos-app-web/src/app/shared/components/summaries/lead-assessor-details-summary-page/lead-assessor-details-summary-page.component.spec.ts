import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LeadAssessorDetailsSummaryPageComponent } from '@shared/components/summaries';
import { ResponsibleUndertakingWizardStep } from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { mockLeadAssessor } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('LeadAssessorDetailsSummaryPageComponent', () => {
  let component: LeadAssessorDetailsSummaryPageComponent;
  let fixture: ComponentFixture<LeadAssessorDetailsSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<LeadAssessorDetailsSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(LeadAssessorDetailsSummaryPageComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.leadAssessor = mockLeadAssessor;
    component.wizardStep = ResponsibleUndertakingWizardStep;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'External',
      'Change',
      'First name',
      'Mike',
      'Change',
      'Last name',
      'Batiste',
      'Change',
      'Email address',
      'dpg@media.com',
      'Change',
      'Professional body',
      'Association of Energy Engineers',
      'Change',
      'Membership name',
      '13',
      'Change',
      'Yes, the lead assessor reviewed and confirmed that the assessment meets the ESOS requirements',
      'Change',
    ]);
  });
});

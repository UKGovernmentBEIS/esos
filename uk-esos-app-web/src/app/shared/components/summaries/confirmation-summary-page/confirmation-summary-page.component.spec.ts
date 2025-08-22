import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ConfirmationSummaryPageComponent } from '@shared/components/summaries';
import { ResponsibleUndertakingWizardStep } from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { mockConfirmations } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('ConfirmationSummaryPageComponent', () => {
  let component: ConfirmationSummaryPageComponent;
  let fixture: ComponentFixture<ConfirmationSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  const routeDMock = {
    noEnergyResponsibilityAssessmentTypes: mockConfirmations.noEnergyResponsibilityAssessmentTypes,
    responsibleOfficerDetails: mockConfirmations.responsibleOfficerDetails,
  };

  class Page extends BasePage<ConfirmationSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(ConfirmationSummaryPageComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.confirmation = routeDMock;
    component.wizardStep = ResponsibleUndertakingWizardStep;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'the organisation is within scope of the scheme but does not have any energy responsibilitythe organisation is compliant with the scheme the relevant sections of the ESOS report have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law the information provided in this notification of compliance is correct',
      'Change',
      'John',
      'Change',
      'Doe',
      'Change',
      'Job title',
      'Change',
      '',
      'Change',
      'Line',
      'Change',
      'City',
      'Change',
      'County',
      'Change',
      'Postcode',
      'Change',
      'UK (44) 1234567890',
      'Change',
      '',
      'Change',
    ]);
  });
});

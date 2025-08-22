import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanResponsibleOfficerConfirmationComponent } from '@shared/components/summaries';
import { mockActionPlanResponsibleOfficerConfirmation } from '@tasks/action-plan/testing/mock-data';

describe('ActionPlanResponsibleOfficerConfirmationComponent', () => {
  let component: ActionPlanResponsibleOfficerConfirmationComponent;
  let fixture: ComponentFixture<ActionPlanResponsibleOfficerConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionPlanResponsibleOfficerConfirmationComponent],
    });
    fixture = TestBed.createComponent(ActionPlanResponsibleOfficerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockActionPlanResponsibleOfficerConfirmation);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

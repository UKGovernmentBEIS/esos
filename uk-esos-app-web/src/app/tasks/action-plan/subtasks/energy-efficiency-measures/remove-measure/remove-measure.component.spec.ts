import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { ActionPlanService } from '@tasks/action-plan/services/action-plan.service';
import { ActivatedRouteStub, mockClass } from '@testing';

import { RemoveMeasureComponent } from './remove-measure.component';

describe('RemoveMeasureComponent', () => {
  let component: RemoveMeasureComponent;
  let fixture: ComponentFixture<RemoveMeasureComponent>;

  const actionPlanService = mockClass(ActionPlanService);
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RemoveMeasureComponent],
      providers: [
        { provide: TaskService, useValue: actionPlanService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    fixture = TestBed.createComponent(RemoveMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-l'));
    expect(headingElement.nativeElement.textContent).toBe('Are you sure you want to remove this measure?');
  });

  it('should display delete button"', () => {
    const buttonElement = fixture.debugElement.query(By.css('.govuk-button--warning'));
    expect(buttonElement.nativeElement.textContent).toBe('Yes, remove the measure');
  });
});

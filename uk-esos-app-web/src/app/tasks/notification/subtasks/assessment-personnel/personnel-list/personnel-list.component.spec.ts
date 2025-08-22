import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockAssessmentPersonnel, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, mockClass } from '@testing';

import PersonnelListComponent from './personnel-list.component';

describe('PersonnelListComponent', () => {
  let component: PersonnelListComponent;
  let fixture: ComponentFixture<PersonnelListComponent>;
  let store: RequestTaskStore;

  const notificationService = mockClass(NotificationService);
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonnelListComponent, RouterTestingModule],
      providers: [
        { provide: TaskService, useValue: notificationService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { assessmentPersonnel: mockAssessmentPersonnel },
        { assessmentPersonnel: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(PersonnelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-l'));
    expect(headingElement.nativeElement.textContent).toBe('Add the assessment personnel (optional)');
  });

  it('should display "Add person" button"', () => {
    const buttonElement = fixture.debugElement.query(By.css('.govuk-button--secondary'));
    expect(buttonElement.nativeElement.textContent).toBe('Add person');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { ActivatedRouteStub, mockClass } from '@testing';

import PersonnelRemoveComponent from './personnel-remove.component';

describe('PersonnelRemoveComponent', () => {
  let component: PersonnelRemoveComponent;
  let fixture: ComponentFixture<PersonnelRemoveComponent>;

  const notificationService = mockClass(NotificationService);
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonnelRemoveComponent],
      providers: [
        { provide: TaskService, useValue: notificationService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    fixture = TestBed.createComponent(PersonnelRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-l'));
    expect(headingElement.nativeElement.textContent).toBe('Are you sure you want to delete this person?');
  });

  it('should display delete button"', () => {
    const buttonElement = fixture.debugElement.query(By.css('.govuk-button--warning'));
    expect(buttonElement.nativeElement.textContent).toBe('Yes, delete this person');
  });
});

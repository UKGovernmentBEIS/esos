import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockClass } from '@testing';
import { screen } from '@testing-library/dom';

import PersonnelComponent from './personnel.component';

describe('PersonnelComponent', () => {
  let component: PersonnelComponent;
  let fixture: ComponentFixture<PersonnelComponent>;

  const notificationService = mockClass(NotificationService);
  const has = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonnelComponent],
      providers: [
        { provide: TaskService, useValue: notificationService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { personIndex: 0, has }, pathFromRoot: [] },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(PersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct form labels', () => {
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Is this person internal or external to your corporate group?')).toBeInTheDocument();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskServiceExtended } from '@common/forms/services/task.service';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TasksAssignmentService } from 'esos-api';

import { SendToRestrictedComponent } from './send-to-restricted.component';

describe('SendToRestrictedComponent', () => {
  let component: SendToRestrictedComponent;
  let fixture: ComponentFixture<SendToRestrictedComponent>;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    sendToRestricted: jest.fn().mockImplementation(),
  };

  const tasksAssignmentService: MockType<TasksAssignmentService> = {
    getCandidateAssigneesByTaskType: jest.fn().mockReturnValue(
      of([
        {
          id: '7752ee-2321e-321552',
          firstName: 'Restricted',
          lastName: 'User',
        },
      ]),
    ),
  };

  class Page extends BasePage<SendToRestrictedComponent> {
    set user(value: string) {
      this.setInputValue('#user', value);
    }
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TasksAssignmentService, useValue: tasksAssignmentService },
        { provide: TaskServiceExtended, useValue: taskService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToRestrictedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send to restricted', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'sendToRestricted');

    page.user = '0: 7752ee-2321e-321552';
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'sendToRestricted',
      userId: '7752ee-2321e-321552',
      data: {
        participantFullName: 'Restricted User',
      },
      currentStep: 'action',
      route: activatedRoute,
    });
  });
});

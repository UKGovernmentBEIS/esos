import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockLeadAssessor, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';
import { screen } from '@testing-library/dom';

import LeadAssessorTypeComponent from './lead-assessor-type.component';

describe('LeadAssessorTypeComponent', () => {
  let component: LeadAssessorTypeComponent;
  let fixture: ComponentFixture<LeadAssessorTypeComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          leadAssessor: mockLeadAssessor,
        } as any,
      };
    },
  };

  class Page extends BasePage<LeadAssessorTypeComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: TaskService, useValue: taskService },
        {
          provide: ActivatedRoute,
          useValue: route,
        },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ leadAssessor: mockLeadAssessor }, { leadAssessor: TaskItemStatus.IN_PROGRESS }));
    fixture = TestBed.createComponent(LeadAssessorTypeComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct form labels', () => {
    expect(
      screen.getByText(
        'Is the lead assessor who reviewed your ESOS assessment internal or external to your corporate group?',
      ),
    ).toBeInTheDocument();
  });

  it(`should submit a valid form and navigate to nextRoute`, () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'leadAssessor',
      currentStep: 'lead-assessor-type',
      route: route,
      payload: {
        noc: {
          leadAssessor: mockLeadAssessor,
        },
      },
    });
  });
});

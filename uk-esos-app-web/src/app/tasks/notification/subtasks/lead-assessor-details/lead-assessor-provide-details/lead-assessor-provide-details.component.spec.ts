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

import LeadAssessorProvideDetailsComponent from './lead-assessor-provide-details.component';

describe('LeadAssessorProvideDetailsComponent', () => {
  let component: LeadAssessorProvideDetailsComponent;
  let fixture: ComponentFixture<LeadAssessorProvideDetailsComponent>;
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

  class Page extends BasePage<LeadAssessorProvideDetailsComponent> {
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
    fixture = TestBed.createComponent(LeadAssessorProvideDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct form labels', () => {
    expect(screen.getByText('Enter the details of the lead assessor who reviewed the assessment')).toBeInTheDocument();
    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Professional body')).toBeInTheDocument();
    expect(screen.getByText('Membership number')).toBeInTheDocument();
  });

  it(`should submit a valid form and navigate to nextRoute`, () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'leadAssessor',
      currentStep: 'lead-assessor-provide-details',
      route: route,
      payload: {
        noc: {
          leadAssessor: mockLeadAssessor,
        },
      },
    });
  });
});

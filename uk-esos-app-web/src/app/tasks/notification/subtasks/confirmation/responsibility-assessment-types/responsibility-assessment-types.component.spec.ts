import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockConfirmations, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';
import { screen } from '@testing-library/dom';

import ResponsibilityAssessmentTypesComponent from './responsibility-assessment-types.component';

describe('ResponsibilityAssessmentTypesComponent', () => {
  let component: ResponsibilityAssessmentTypesComponent;
  let fixture: ComponentFixture<ResponsibilityAssessmentTypesComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          confirmations: mockConfirmations,
        } as any,
      };
    },
  };

  class Page extends BasePage<ResponsibilityAssessmentTypesComponent> {
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
    store.setState(mockStateBuild({ confirmations: mockConfirmations }, { confirmations: TaskItemStatus.IN_PROGRESS }));
    fixture = TestBed.createComponent(ResponsibilityAssessmentTypesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct form labels', () => {
    expect(screen.getByText('Confirm that a responsible officer...')).toBeInTheDocument();
  });

  it(`should submit a valid form and navigate to nextRoute`, () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'confirmations',
      currentStep: 'responsibility-assessment-types',
      route: route,
      payload: {
        noc: {
          confirmations: mockConfirmations,
        },
      },
    });
  });
});

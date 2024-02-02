import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockLeadAssessor, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import SummaryComponent from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          leadAssessor: mockLeadAssessor,
        } as any,
      };
    },
  };

  class Page extends BasePage<SummaryComponent> {
    get summaryComponent() {
      return this.query<HTMLElement>('esos-lead-assessor-details-summary-page');
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });
    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ leadAssessor: mockLeadAssessor }, { leadAssessor: TaskItemStatus.IN_PROGRESS }));
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaryComponent).toBeTruthy();
    expect(page.submitButton).toBeTruthy();
  });

  it(`should submit a valid form and navigate to nextRoute`, () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'leadAssessor',
      currentStep: 'summary',
      route: route,
      payload: {
        noc: {
          leadAssessor: mockLeadAssessor,
        },
      },
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { pu1CommonQueryProvider } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate1Service } from '@tasks/progress-update-1/services/progress-update-1.service';
import { mockProgressUpdate1P3, mockStateBuild } from '@tasks/progress-update-1/testing/mock-data';
import {
  ProgressUpdateResponsibleOfficerConfirmationStep,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<ProgressUpdate1Service> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): ProgressUpdate1TaskPayload {
      return {
        progressUpdate1P3: mockProgressUpdate1P3,
      };
    },
  };

  class Page extends BasePage<SummaryComponent> {
    get summaryComponent() {
      return this.query<HTMLElement>('esos-pu-responsible-officer-confirmation-summary-page');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
        pu1CommonQueryProvider,
      ],
    });
    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({}, { responsibleOfficerConfirmation: TaskItemStatus.IN_PROGRESS }));
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

  it('should submit a valid form and navigate to nextRoute', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ProgressUpdateResponsibleOfficerConfirmationStep.SUMMARY,
      payload: { progressUpdate1P3: mockProgressUpdate1P3 },
      route,
    });
  });
});

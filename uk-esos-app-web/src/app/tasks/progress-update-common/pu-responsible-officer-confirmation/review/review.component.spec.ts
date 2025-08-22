import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { pu1CommonQueryProvider } from '@tasks/progress-update-1/+state/progress-update-1.selectors';
import {
  mockProgressUpdate1P3Measure1,
  mockProgressUpdate1P3Measure2,
  mockProgressUpdate1P3Measure4,
  mockProgressUpdate1ResponsibleOfficerConfirmation,
} from '@tasks/progress-update-1/testing/mock-data';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import {
  ProgressUpdateResponsibleOfficerConfirmationStep,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
} from '../pu-responsible-officer-confirmation.helper';
import { ReviewComponent } from './review.component';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const progressUpdate1P3 = {
    progressUpdate1P3MeasuresUpdate: {
      progressUpdate1P3Measures: [mockProgressUpdate1P3Measure1, mockProgressUpdate1P3Measure4],
      progressUpdate1P3AddedMeasure: [],
    },
  };

  const taskService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    saveSubtask: () => {},
    payload: { progressUpdate1P3 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
        pu1CommonQueryProvider,
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({
      requestTask: {
        payload: { progressUpdate1P3 },
      },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show two checkboxes', () => {
    expect(checkboxes()).toHaveLength(2);
  });

  it('should show only one checkbox', () => {
    store.setRequestTaskItem({
      requestTask: {
        payload: {
          progressUpdate1P3: {
            progressUpdate1P3MeasuresUpdate: {
              progressUpdate1P3Measures: [mockProgressUpdate1P3Measure1, mockProgressUpdate1P3Measure2],
              progressUpdate1P3AddedMeasure: [],
            },
            responsibleOfficerConfirmation: [],
          },
        },
      },
    } as Partial<RequestTaskItemDTO>);
    fixture = TestBed.createComponent(ReviewComponent);
    fixture.detectChanges();

    expect(checkboxes()).toHaveLength(1);
  });

  it('should show errors checkboxes not checked', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/You must confirm all of these statements are true/)).toHaveLength(2);
  });

  it('should save subtask when both checkboxes checked', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.click(checkboxes()[0]);
    fixture.detectChanges();

    await user.click(checkboxes()[1]);
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_NAME,
      currentStep: ProgressUpdateResponsibleOfficerConfirmationStep.REVIEW,
      payload: {
        progressUpdate1P3: {
          ...progressUpdate1P3,
          responsibleOfficerConfirmation: mockProgressUpdate1ResponsibleOfficerConfirmation,
        },
      },
      route,
    });
  });

  function checkboxes() {
    return screen.getAllByRole('checkbox');
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});

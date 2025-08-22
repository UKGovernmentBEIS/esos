import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate1Service } from '@tasks/progress-update-1/services/progress-update-1.service';
import { mockProgressUpdate1P3, mockStateBuild } from '@tasks/progress-update-1/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu1-energy-efficiency-measures.helper';
import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let page: Page;
  let router: Router;
  let store: RequestTaskStore;

  const pu1Service: MockType<ProgressUpdate1Service> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): ProgressUpdate1TaskPayload {
      return {
        progressUpdate1P3: mockProgressUpdate1P3,
        progressUpdate1P3SectionsCompleted: {
          [PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME]: TaskItemStatus.IN_PROGRESS,
        },
      };
    },
  };

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<SummaryComponent> {
    get summaryComponent() {
      return this.query<HTMLElement>('esos-pu1-energy-efficiency-measures-summary-page');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get addMeasureButton(): HTMLAnchorElement {
      return this.query('a.govuk-button--secondary');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: TaskService, useValue: pu1Service },
      ],
    });
    router = TestBed.inject(Router);

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({}, { [PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME]: TaskItemStatus.IN_PROGRESS }));
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
    expect(page.addMeasureButton).toBeTruthy();
    expect(page.submitButton).toBeTruthy();
  });

  it('should navigate when Add Another Measure button clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');

    page.addMeasureButton.click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should submit a valid form', () => {
    const taskServiceSpy = jest.spyOn(pu1Service, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.SUMMARY,
      payload: {
        progressUpdate1P3: mockProgressUpdate1P3,
        progressUpdate1P3SectionsCompleted: { progressUpdate1P3MeasuresUpdate: 'IN_PROGRESS' },
      },
      route: activatedRoute,
      applySideEffects: true,
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { ReductionAchievedComponent } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/reduction-achieved/reduction-achieved.component';
import { mockSecondCompliancePeriod, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TasksService } from 'esos-api';

describe('ReductionAchievedComponent', () => {
  let component: ReductionAchievedComponent;
  let fixture: ComponentFixture<ReductionAchievedComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  const seState = () => {
    store.setState(
      mockStateBuild(
        { secondCompliancePeriod: { ...mockSecondCompliancePeriod } },
        { secondCompliancePeriod: TaskItemStatus.IN_PROGRESS },
      ),
    );
  };

  class Page extends BasePage<ReductionAchievedComponent> {
    get caption() {
      return this.query<HTMLSpanElement>('span[class^="govuk-caption-"]');
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: route },
        { provide: TasksService, useValue: tasksService },
        { provide: COMPLIANCE_PERIOD_SUB_TASK, useValue: CompliancePeriodSubtask.SECOND },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    seState();

    fixture = TestBed.createComponent(ReductionAchievedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct caption based on compliance period', () => {
    expect(page.caption.textContent.trim()).toEqual('Second compliance period');
  });

  it('should navigate to the next page after submitting valid data and display the correct headings', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(tasksService.processRequestTaskAction).toHaveBeenCalled();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['../'], expect.anything());
  });

  it('should display the correct heading and total', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain(WIZARD_STEP_HEADINGS['reduction-achieved'](false));

    expect(compiled.querySelector('h2.govuk-heading-m').textContent).toContain('Total');
  });
});

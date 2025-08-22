import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { mockEnergySavingOpportunities, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TasksService } from 'esos-api';

import { EnergySavingsOpportunitiesWizardStep } from '../energy-savings-opportunity.helper';
import EnergySavingsOpportunityComponent from './energy-savings-opportunity.component';

describe('EnergySavingsOpportunityComponent', () => {
  let component: EnergySavingsOpportunityComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunityComponent>;
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
        { energySavingsOpportunities: { ...mockEnergySavingOpportunities } },
        { energySavingsOpportunities: TaskItemStatus.IN_PROGRESS },
      ),
    );
  };

  class Page extends BasePage<EnergySavingsOpportunityComponent> {
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
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    seState();

    fixture = TestBed.createComponent(EnergySavingsOpportunityComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the next page after submitting valid data and display the correct headings', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(tasksService.processRequestTaskAction).toHaveBeenCalled();

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('Energy savings opportunities');

    expect(compiled.textContent).toContain(
      'Total annual reduction in energy consumption and energy spend by organisational purpose',
    );

    expect(navigateSpy).toHaveBeenCalledWith([`../${EnergySavingsOpportunitiesWizardStep.STEP3}`], {
      relativeTo: route,
    });
  });
});

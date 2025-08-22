import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

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

import EnergySavingsOpportunitySummaryComponent from './energy-savings-opportunity-summary.component';

describe('EnergySavingsOpportunitySummaryComponent', () => {
  let component: EnergySavingsOpportunitySummaryComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitySummaryComponent>;

  let store: RequestTaskStore;
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

  class Page extends BasePage<EnergySavingsOpportunitySummaryComponent> {
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
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

    fixture = TestBed.createComponent(EnergySavingsOpportunitySummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the summary details', () => {
    expect(page.tableCells).toEqual([
      '',
      'kWh',
      '£',
      '',
      'Total annual reduction',
      '100',
      '2.00',
      'Change',
      '',
      'kWh',
      '£',
      '',
      'Buildings',
      '2',
      '2.00',
      'Change',
      'Transport',
      '4',
      '2.00',
      'Change',
      'Industrial processes',
      '9',
      '4.45',
      'Change',
      'Other energy uses',
      '13',
      '110.60',
      'Change',
      'Total',
      '28',
      '117.05',
      '',
      '',
      'kWh',
      '£',
      '',
      'Energy management practices',
      '1',
      '1.00',
      'Change',
      'Behaviour change interventions',
      '2',
      '2.20',
      'Change',
      'Training',
      '3',
      '3.03',
      'Change',
      'Controls improvements',
      '4',
      '4.00',
      'Change',
      'Capital investments',
      '6',
      '4.00',
      'Change',
      'Other measures not covered by one of the above',
      '7',
      '4.00',
      'Change',
      'Total',
      '28',
      '6.23',
      '',
    ]);
  });
});

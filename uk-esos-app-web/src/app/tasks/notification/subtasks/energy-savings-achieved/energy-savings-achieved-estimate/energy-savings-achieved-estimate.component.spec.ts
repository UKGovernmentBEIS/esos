import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { mockEnergySavingsAchieved, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage } from '@testing';

import EnergySavingsAchievedEstimateComponent from './energy-savings-achieved-estimate.component';

describe('EnergySavingsAchievedEstimateComponent', () => {
  let component: EnergySavingsAchievedEstimateComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedEstimateComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedEstimateComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get buildings() {
      return this.getInputValue('#buildings');
    }

    get transport() {
      return this.getInputValue('#transport');
    }

    get industrialProcesses() {
      return this.getInputValue('#industrialProcesses');
    }

    get otherProcesses() {
      return this.getInputValue('#otherProcesses');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsAchievedEstimateComponent],
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { energySavingsAchieved: mockEnergySavingsAchieved },
        { energySavingsAchieved: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(EnergySavingsAchievedEstimateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading and all form fields', () => {
    expect(page.heading1.textContent.trim()).toEqual(
      'What is the breakdown of an estimate of the energy savings achieved during the third compliance period?',
    );

    expect(page.buildings).toBe('0');
    expect(page.transport).toBe('0');
    expect(page.industrialProcesses).toBe('0');
    expect(page.otherProcesses).toBe('0');
  });
});

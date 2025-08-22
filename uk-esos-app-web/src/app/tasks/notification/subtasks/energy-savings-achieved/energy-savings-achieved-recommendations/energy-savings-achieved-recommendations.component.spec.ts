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

import EnergySavingsAchievedRecommendationsComponent from './energy-savings-achieved-recommendations.component';

describe('EnergySavingsAchievedRecommendationsComponent', () => {
  let component: EnergySavingsAchievedRecommendationsComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedRecommendationsComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedRecommendationsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get energyAudits() {
      return this.getInputValue('#energyAudits');
    }

    get alternativeComplianceRoutes() {
      return this.getInputValue('#alternativeComplianceRoutes');
    }

    get other() {
      return this.getInputValue('#other');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsAchievedRecommendationsComponent],
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

    fixture = TestBed.createComponent(EnergySavingsAchievedRecommendationsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading and all form fields', () => {
    expect(page.heading1.textContent.trim()).toEqual(
      'What is the breakdown of the proportion of energy savings achieved which relate to recommendations from the following categories? (optional)',
    );

    expect(page.energyAudits).toBe('0');
    expect(page.alternativeComplianceRoutes).toBe('0');
    expect(page.other).toBe('0');
  });
});

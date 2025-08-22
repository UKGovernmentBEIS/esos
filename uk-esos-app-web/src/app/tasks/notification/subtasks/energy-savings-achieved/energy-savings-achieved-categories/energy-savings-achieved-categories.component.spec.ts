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

import EnergySavingsAchievedCategoriesComponent from './energy-savings-achieved-categories.component';

describe('EnergySavingsAchievedCategoriesComponent', () => {
  let component: EnergySavingsAchievedCategoriesComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedCategoriesComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedCategoriesComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get energyManagementPractices() {
      return this.getInputValue('#energyManagementPractices');
    }

    get behaviourChangeInterventions() {
      return this.getInputValue('#behaviourChangeInterventions');
    }

    get training() {
      return this.getInputValue('#training');
    }

    get controlsImprovements() {
      return this.getInputValue('#controlsImprovements');
    }

    get capitalInvestments() {
      return this.getInputValue('#capitalInvestments');
    }

    get otherMeasures() {
      return this.getInputValue('#otherMeasures');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsAchievedCategoriesComponent],
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

    fixture = TestBed.createComponent(EnergySavingsAchievedCategoriesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading and all form fields', () => {
    expect(page.heading1.textContent.trim()).toEqual(
      'What is the breakdown of the energy savings achieved during the compliance period against the following energy saving categories? (optional)',
    );

    expect(page.energyManagementPractices).toBe('0');
    expect(page.behaviourChangeInterventions).toBe('0');
    expect(page.training).toBe('0');
    expect(page.controlsImprovements).toBe('0');
    expect(page.capitalInvestments).toBe('0');
    expect(page.otherMeasures).toBe('0');
  });
});

import { HttpClient, HttpHandler } from '@angular/common/http';
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
import { EnergyIntensityRatioComponent } from '@tasks/notification/subtasks/energy-consumption/energy-intensity-ratio/energy-intensity-ratio.component';
import { mockEnergyConsumptionDetails, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TasksService } from 'esos-api';

describe('EnergyIntensityRatioComponent', () => {
  let component: EnergyIntensityRatioComponent;
  let fixture: ComponentFixture<EnergyIntensityRatioComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<EnergyIntensityRatioComponent> {
    get ratios() {
      return this.queryAll<HTMLInputElement>('input[name$="ratio"]');
    }
    get units() {
      return this.queryAll<HTMLInputElement>('input[name$="unit"]');
    }
    get additionalInformation() {
      return this.queryAll<HTMLTextAreaElement>('textarea[id$="additionalInformation"]');
    }

    set ratio(value: number) {
      this.setInputValue('#buildingsIntensityRatio.ratio', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
    }
    get errors() {
      return this.queryAll<HTMLLIElement>('ul.govuk-error-summary__list > li');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        SideEffectsHandler,
        RequestTaskStore,
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: route },
        { provide: TasksService, useValue: tasksService },
      ],
    });
  });

  describe('when edit energy intensity ratio', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { energyConsumptionDetails: mockEnergyConsumptionDetails },
          { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(EnergyIntensityRatioComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show input values', () => {
      expect(page.ratios.length).toEqual(2);
      expect(page.ratios[0].value).toEqual('50');
      expect(page.ratios[1].value).toEqual('70');

      expect(page.units.length).toEqual(2);
      expect(page.units[0].value).toEqual('m2');
      expect(page.units[1].value).toEqual('m2');

      expect(page.additionalInformation.length).toEqual(2);
      expect(page.additionalInformation[0].value).toEqual('Buildings additional information');
      expect(page.additionalInformation[1].value).toEqual('Industrial processes additional information');
    });
  });

  describe('for new energy intensity ratio', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            energyConsumptionDetails: {
              totalEnergyConsumption: mockEnergyConsumptionDetails.totalEnergyConsumption,
              significantEnergyConsumptionExists: true,
              significantEnergyConsumption: mockEnergyConsumptionDetails.significantEnergyConsumption,
            },
          },
          { energyConsumptionDetails: null },
        ),
      );

      fixture = TestBed.createComponent(EnergyIntensityRatioComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});

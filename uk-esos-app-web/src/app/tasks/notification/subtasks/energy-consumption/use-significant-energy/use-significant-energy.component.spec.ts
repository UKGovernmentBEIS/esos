import { HttpClient, HttpHandler } from '@angular/common/http';
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
import { UseSignificantEnergyComponent } from '@tasks/notification/subtasks/energy-consumption/use-significant-energy/use-significant-energy.component';
import {
  mockEnergyConsumptionDetails,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('UseSignificantEnergyComponent', () => {
  let component: UseSignificantEnergyComponent;
  let fixture: ComponentFixture<UseSignificantEnergyComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<UseSignificantEnergyComponent> {
    get significantEnergyConsumptionExistsRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="significantEnergyConsumptionExists"]');
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

  describe('when edit use significant energy', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { energyConsumptionDetails: mockEnergyConsumptionDetails },
          { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(UseSignificantEnergyComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show input values', () => {
      expect(page.significantEnergyConsumptionExistsRadios[0].checked).toBeTruthy;
      expect(page.significantEnergyConsumptionExistsRadios[1].checked).toBeFalsy;
    });

    it('should submit and navigate to energy intensity ratio page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.significantEnergyConsumptionExistsRadios[1].click();
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
            energyConsumptionDetails: {
              additionalInformation: 'Additional info',
              additionalInformationExists: true,
              energyIntensityRatioData: {
                buildings: {
                  additionalInformation: 'Buildings additional information',
                  energyIntensityRatios: [
                    {
                      ratio: '50',
                      unit: 'm2',
                    },
                  ],
                },
                industrialProcesses: {
                  additionalInformation: 'Industrial processes additional information',
                  energyIntensityRatios: [
                    {
                      ratio: '70',
                      unit: 'm2',
                    },
                  ],
                },
              },
              significantEnergyConsumptionExists: false,
              totalEnergyConsumption: {
                buildings: 100,
                industrialProcesses: 50,
                otherProcesses: 0,
                total: 150,
                transport: 0,
              },
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            energyConsumptionDetails: 'IN_PROGRESS',
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../energy-intensity-ratio'], { relativeTo: route });
    });
  });

  describe('for new use significant energy', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            energyConsumptionDetails: {
              totalEnergyConsumption: mockEnergyConsumptionDetails.totalEnergyConsumption,
            },
          },
          { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(UseSignificantEnergyComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should submit and navigate to significant energy page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Please select Yes or No']);

      page.significantEnergyConsumptionExistsRadios[0].click();
      page.submitButton.click();
      fixture.detectChanges();

      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
            energyConsumptionDetails: {
              totalEnergyConsumption: mockEnergyConsumptionDetails.totalEnergyConsumption,
              significantEnergyConsumptionExists: true,
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            energyConsumptionDetails: 'IN_PROGRESS',
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../significant-energy'], { relativeTo: route });
    });
  });
});

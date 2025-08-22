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
import { TotalEnergyComponent } from '@tasks/notification/subtasks/energy-consumption/total-energy/total-energy.component';
import {
  mockEnergyConsumptionDetails,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('TotalEnergyComponent', () => {
  let component: TotalEnergyComponent;
  let fixture: ComponentFixture<TotalEnergyComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<TotalEnergyComponent> {
    set buildings(value: number) {
      this.setInputValue('#buildings', value);
    }
    get buildings() {
      return this.getInputValue('[name="buildings"]');
    }
    set transport(value: number) {
      this.setInputValue('#transport', value);
    }
    get transport() {
      return this.getInputValue('[name="transport"]');
    }
    set industrialProcesses(value: number) {
      this.setInputValue('#industrialProcesses', value);
    }
    get industrialProcesses() {
      return this.getInputValue('[name="industrialProcesses"]');
    }
    set otherProcesses(value: number) {
      this.setInputValue('#otherProcesses', value);
    }
    get otherProcesses() {
      return this.getInputValue('[name="otherProcesses"]');
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

  describe('when edit total energy', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { energyConsumptionDetails: mockEnergyConsumptionDetails },
          { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(TotalEnergyComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show input values', () => {
      expect(page.buildings).toEqual('100');
      expect(page.transport).toEqual('0');
      expect(page.industrialProcesses).toEqual('50');
      expect(page.otherProcesses).toEqual('0');
    });

    it('should submit and navigate to use significant energy page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.buildings = 10;
      page.transport = 20;
      page.industrialProcesses = 30;
      page.otherProcesses = 40;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            assessmentPersonnel: {},
            confirmations: {},
            contactPersons: {},
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
              significantEnergyConsumption: {
                buildings: 100,
                industrialProcesses: 45,
                otherProcesses: 0,
                significantEnergyConsumptionPct: 145,
                total: 145,
                transport: 0,
              },
              significantEnergyConsumptionExists: true,
              totalEnergyConsumption: {
                buildings: 10,
                industrialProcesses: 30,
                otherProcesses: 40,
                total: 100,
                transport: 20,
              },
            },
            organisationStructure: {},
            reportingObligation: {
              qualificationType: 'QUALIFY',
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            energyConsumptionDetails: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../use-significant-energy'], { relativeTo: route });
    });
  });

  describe('for new total energy', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(mockStateBuild({ energyConsumptionDetails: null }, { energyConsumptionDetails: null }));

      fixture = TestBed.createComponent(TotalEnergyComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show default input values', () => {
      expect(page.buildings).toEqual('0');
      expect(page.transport).toEqual('0');
      expect(page.industrialProcesses).toEqual('0');
      expect(page.otherProcesses).toEqual('0');
    });

    it('should submit and navigate to use significant energy page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      expect(page.errorSummary).toBeFalsy();

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Enter a value of energy in KWh']);

      page.buildings = 10;
      page.transport = 20;
      page.industrialProcesses = 30;
      page.otherProcesses = 40;

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
              totalEnergyConsumption: {
                buildings: 10,
                transport: 20,
                industrialProcesses: 30,
                otherProcesses: 40,
                total: 100,
              },
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            energyConsumptionDetails: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../use-significant-energy'], { relativeTo: route });
    });
  });
});

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
import { EnergyConsumptionSummaryComponent } from '@tasks/notification/subtasks/energy-consumption/summary/summary.component';
import {
  mockEnergyConsumptionDetails,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('EnergyConsumptionSummaryComponent', () => {
  let component: EnergyConsumptionSummaryComponent;
  let fixture: ComponentFixture<EnergyConsumptionSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<EnergyConsumptionSummaryComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
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

  beforeEach(() => {
    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { energyConsumptionDetails: mockEnergyConsumptionDetails },
        { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(EnergyConsumptionSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
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
              significantEnergyConsumptionPct: 96,
              total: 145,
              transport: 0,
            },
            significantEnergyConsumptionExists: true,
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
          energyConsumptionDetails: TaskItemStatus.COMPLETED,
        },
      } as RequestTaskActionPayload,
    });
  });
});

import { RequestTaskState } from '@common/request-task/+state';
import { mockRequestTask } from '@common/request-task/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { ActionPlanP3, EnergyEfficiencyMeasure } from 'esos-api';

import { ActionPlanTaskPayload } from '../action-plan.types';

export const mockEnergyEfficiencyMeasure1: EnergyEfficiencyMeasure = {
  measureName: 'Measure Name 1',
  isEnergySavingsOpportunityReportedInAudit: true,
  measureScheme: ['CLIMATE_CHANGE_AGREEMENTS_CCA', 'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR', 'OTHER'],
  otherMeasureSchemeName: 'The other measure scheme name',
  totalEnergySavingsExpected: {
    buildings: 65856,
    transport: 0,
    industrialProcesses: 0,
    otherProcesses: 0,
    total: 65856,
  },
  implementationDateForMeasure: '2025-04-01',
  energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
  measureContext: 'Ab ovo',
};

export const mockEnergyEfficiencyMeasure2: EnergyEfficiencyMeasure = {
  measureName: 'Measure Name 2',
  isEnergySavingsOpportunityReportedInAudit: false,
  totalEnergySavingsExpected: {
    buildings: 1,
    transport: 2,
    industrialProcesses: 3,
    otherProcesses: 4,
    total: 10,
  },
  implementationDateForMeasure: '2027-03-01',
  energySavingsEstimateCalculatedType: 'OTHER_REASONABLE_ESTIMATION_METHOD',
  estimationMethodDescription: 'Sed ut perspiciatis unde omnis iste natus',
  measureContext: 'Illum qui dolorem eum fugiat quo voluptas nulla pariatur',
};

export const mockActionPlanEnergyEfficiencyMeasure = {
  haveEnergyEfficiencyMeasures: true,
  energyEfficiencyMeasures: [mockEnergyEfficiencyMeasure1, mockEnergyEfficiencyMeasure2],
};

export const mockActionPlanResponsibleOfficerConfirmation: ActionPlanP3['responsibleOfficerConfirmation'] = [
  'ESOS_ASSESSMENT_NOTIFICATION',
  'ESTIMATION_METHOD_DESCRIPTION',
];

export const mockActionPlanTaskPayload: ActionPlanTaskPayload = {
  actionPlanP3: {
    energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
    responsibleOfficerConfirmation: [],
  },
};

export const mockActionPlanRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        actionPlanP3: {
          energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure,
          responsibleOfficerConfirmation: [],
        },
        actionPlanSectionsCompleted: {
          energyEfficiencyMeasure: 'IN_PROGRESS',
        },
      } as unknown as ActionPlanTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof ActionPlanTaskPayload['actionPlanP3'], any>>,
  taskStatus?: Partial<Record<keyof ActionPlanTaskPayload['actionPlanP3'], TaskItemStatus>>,
): RequestTaskState => {
  return {
    ...mockActionPlanRequestTask,
    requestTaskItem: produce(mockActionPlanRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as ActionPlanTaskPayload;

      payload.actionPlanP3 = { ...payload.actionPlanP3, ...data };
      payload.actionPlanSectionsCompleted = { ...payload.actionPlanSectionsCompleted, ...taskStatus };
    }),
  };
};

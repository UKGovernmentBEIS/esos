import { RequestTaskState } from '@common/request-task/+state';
import { mockRequestTask } from '@common/request-task/testing/mock-data';
import {
  mockProgressUpdate1P3AddedMeasure1,
  mockProgressUpdate1P3AddedMeasure2,
  mockProgressUpdate1P3Measure1,
  mockProgressUpdate1P3Measure2,
  mockProgressUpdate1P3Measure3,
  mockProgressUpdate1P3Measure4,
} from '@tasks/progress-update-1/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import {
  ProgressUpdate2P3,
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import { ProgressUpdate2TaskPayload } from '../progress-update-2.types';

export const mockProgressUpdate2ResponsibleOfficerConfirmation: ProgressUpdate2P3['responsibleOfficerConfirmation'] = [
  'ESOS_ACTION_PLAN_COMPLIANCE',
  'ESTIMATION_METHOD_DOCUMENTED',
];

export const mockProgressUpdate2P3Measure1: ProgressUpdate2P3UpdatedMeasure = {
  uuId: mockProgressUpdate1P3Measure1.uuId,
  actionPlanEnergyEfficiencyMeasure: mockProgressUpdate1P3Measure1.actionPlanEnergyEfficiencyMeasure,
  progressUpdate1P3EnergyEfficiencyMeasure: mockProgressUpdate1P3Measure1.progressUpdate1P3EnergyEfficiencyMeasure,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    providedContext: 'CTX1',
    reportReduction2025To2026: false,
  },
};

export const mockProgressUpdate2P3Measure2: ProgressUpdate2P3UpdatedMeasure = {
  uuId: mockProgressUpdate1P3Measure2.uuId,
  actionPlanEnergyEfficiencyMeasure: mockProgressUpdate1P3Measure2.actionPlanEnergyEfficiencyMeasure,
  progressUpdate1P3EnergyEfficiencyMeasure: mockProgressUpdate1P3Measure2.progressUpdate1P3EnergyEfficiencyMeasure,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    measureIsImplemented: true,
    measureImplementedByTheDateInActionPlan: true,
    reductionEnergyConsumption2025To2026: 2143,
    estimationMethodType: 'ACTION_PLAN_ESTIMATE',
  },
};

export const mockProgressUpdate2P3Measure3: ProgressUpdate2P3UpdatedMeasure = {
  uuId: mockProgressUpdate1P3Measure3.uuId,
  actionPlanEnergyEfficiencyMeasure: mockProgressUpdate1P3Measure3.actionPlanEnergyEfficiencyMeasure,
  progressUpdate1P3EnergyEfficiencyMeasure: mockProgressUpdate1P3Measure3.progressUpdate1P3EnergyEfficiencyMeasure,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    providedContext: 'CTX PU2 M3',
    reportReduction2025To2026: false,
  },
};

export const mockProgressUpdate2P3Measure4: ProgressUpdate2P3UpdatedMeasure = {
  uuId: mockProgressUpdate1P3Measure4.uuId,
  actionPlanEnergyEfficiencyMeasure: mockProgressUpdate1P3Measure4.actionPlanEnergyEfficiencyMeasure,
  progressUpdate1P3EnergyEfficiencyMeasure: mockProgressUpdate1P3Measure4.progressUpdate1P3EnergyEfficiencyMeasure,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    providedContext: 'CTX PU2 M4',
    reportReduction2025To2026: true,
    reductionEnergyConsumption2025To2026: 1111,
    estimationMethodType: 'OTHER_METHOD',
    estimationMethodDescription: 'GG other method',
  },
};

export const mockProgressUpdate2P3UpdatedAddedMeasure1: ProgressUpdate2P3UpdatedAddedMeasure = {
  uuId: 'db06c697-a4ae-4f04-8690-e9bab4fcab8f',
  progressUpdate1P3AddedMeasure: mockProgressUpdate1P3AddedMeasure1,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    providedContext: 'CTX: PU2 for PU1 Added M1',
    reportReduction2025To2026: true,
    reductionEnergyConsumption2025To2026: 313,
  },
};

export const mockProgressUpdate2P3UpdatedAddedMeasure2: ProgressUpdate2P3UpdatedAddedMeasure = {
  uuId: '2393d7fd-143f-4f49-af99-270d6f3e926a',
  progressUpdate1P3AddedMeasure: mockProgressUpdate1P3AddedMeasure2,
  progressUpdate2P3EnergyEfficiencyMeasure: {
    providedContext: 'NO CTX',
    reportReduction2025To2026: false,
  },
};

export const mockProgressUpdate2P3AddedMeasure1: ProgressUpdate2P3AddedMeasure = {
  measureName: 'New PU2 measure A1',
  estimationMethodType: 'NO_METHOD_USED',
  reductionEnergyConsumption2025To2026: 12,
};

export const mockProgressUpdate2P3AddedMeasure2: ProgressUpdate2P3AddedMeasure = {
  measureName: 'New PU2 measure A2',
  measureScheme: [
    'CLIMATE_CHANGE_AGREEMENTS_CCA',
    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
    'UK_EMISSIONS_TRADING_SCHEME_ETS',
    'UN_RACE_TO_ZERO',
    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
    'CARBON_REDUCTION_PLANS',
    'OTHER',
  ],
  estimationMethodType: 'OTHER_METHOD',
  estimationMethodDescription: 'Another reasonable method',
  otherMeasureSchemeName: 'Other6',
  reductionEnergyConsumption2025To2026: 232,
  measureContext: 'AA',
};

export const mockProgressUpdate2P3Measures: ProgressUpdate2P3UpdatedMeasure[] = [
  mockProgressUpdate2P3Measure1,
  mockProgressUpdate2P3Measure2,
  mockProgressUpdate2P3Measure3,
  mockProgressUpdate2P3Measure4,
];

export const mockProgressUpdate2P3UpdatedAddedMeasures: ProgressUpdate2P3UpdatedAddedMeasure[] = [
  mockProgressUpdate2P3UpdatedAddedMeasure1,
  mockProgressUpdate2P3UpdatedAddedMeasure2,
];

export const mockProgressUpdate2P3AddedMeasures: ProgressUpdate2P3AddedMeasure[] = [
  mockProgressUpdate2P3AddedMeasure1,
  mockProgressUpdate2P3AddedMeasure2,
];

export const mockProgressUpdate2P3: ProgressUpdate2P3 = {
  responsibleOfficerConfirmation: mockProgressUpdate2ResponsibleOfficerConfirmation,
  progressUpdate2P3MeasuresUpdate: {
    progressUpdate2P3Measures: mockProgressUpdate2P3Measures,
    progressUpdate2P3UpdatedAddedMeasures: mockProgressUpdate2P3UpdatedAddedMeasures,
    progressUpdate2P3AddedMeasure: mockProgressUpdate2P3AddedMeasures,
  },
};

export const mockProgressUpdate2RequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        progressUpdate2P3: mockProgressUpdate2P3,
        progressUpdate2P3SectionsCompleted: {
          progressUpdate2P3MeasuresUpdate: TaskItemStatus.COMPLETED,
          responsibleOfficerConfirmation: TaskItemStatus.COMPLETED,
        },
      } as unknown as ProgressUpdate2TaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof ProgressUpdate2TaskPayload['progressUpdate2P3'], any>>,
  taskStatus?: Partial<Record<keyof ProgressUpdate2TaskPayload['progressUpdate2P3'], TaskItemStatus>>,
): RequestTaskState => {
  return {
    ...mockProgressUpdate2RequestTask,
    requestTaskItem: produce(mockProgressUpdate2RequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as ProgressUpdate2TaskPayload;

      payload.progressUpdate2P3 = { ...payload.progressUpdate2P3, ...data };
      payload.progressUpdate2P3SectionsCompleted = { ...payload.progressUpdate2P3SectionsCompleted, ...taskStatus };
    }),
  };
};

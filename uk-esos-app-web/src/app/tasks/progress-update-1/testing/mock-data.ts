import { RequestTaskState } from '@common/request-task/+state';
import { mockRequestTask } from '@common/request-task/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { ProgressUpdate1P3, ProgressUpdate1P3AddedMeasure, ProgressUpdate1P3UpdatedMeasure } from 'esos-api';

import { ProgressUpdate1TaskPayload } from '../progress-update-1.types';

export const mockProgressUpdate1ResponsibleOfficerConfirmation: ProgressUpdate1P3['responsibleOfficerConfirmation'] = [
  'ESOS_ACTION_PLAN_COMPLIANCE',
  'ESTIMATION_METHOD_DOCUMENTED',
];

export const mockProgressUpdate1P3Measure1: ProgressUpdate1P3UpdatedMeasure = {
  uuId: '5f570111-05f6-4750-9850-56c2b208b2c9',
  measureImplType: 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN',
  actionPlanEnergyEfficiencyMeasure: {
    measureName: 'Dorem! (before AP sub)',
    measureScheme: [
      'UK_EMISSIONS_TRADING_SCHEME_ETS',
      'OTHER',
      'CARBON_REDUCTION_PLANS',
      'UN_RACE_TO_ZERO',
      'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
      'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
      'CLIMATE_CHANGE_AGREEMENTS_CCA',
    ],
    measureContext: 'Kontekst',
    otherMeasureSchemeName: 'Other6 lipsum',
    totalEnergySavingsExpected: {
      total: 3465,
      buildings: 233,
      transport: 0,
      otherProcesses: 0,
      industrialProcesses: 3232,
    },
    implementationDateForMeasure: '2024-10-01',
    energySavingsEstimateCalculatedType: 'ALTERNATIVE_COMPLIANCE_METHOD',
    isEnergySavingsOpportunityReportedInAudit: true,
  },
  progressUpdate1P3EnergyEfficiencyMeasure: {
    providedContext: 'CTX1',
    reportReduction2023To2024: false,
    reportReduction2024To2025: false,
  },
};

export const mockProgressUpdate1P3Measure2: ProgressUpdate1P3UpdatedMeasure = {
  uuId: '2e10270e-38cd-4489-873f-10155df343c1',
  measureImplType: 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN',
  actionPlanEnergyEfficiencyMeasure: {
    measureName: 'M22',
    measureScheme: ['UK_EMISSIONS_TRADING_SCHEME_ETS', 'UN_RACE_TO_ZERO'],
    totalEnergySavingsExpected: {
      total: 78,
      buildings: 3,
      transport: 4,
      otherProcesses: 66,
      industrialProcesses: 5,
    },
    implementationDateForMeasure: '2026-02-01',
    energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
    isEnergySavingsOpportunityReportedInAudit: false,
  },
  progressUpdate1P3EnergyEfficiencyMeasure: { measureIsImplemented: false },
};

export const mockProgressUpdate1P3Measure3: ProgressUpdate1P3UpdatedMeasure = {
  uuId: '87e9e64c-43f0-40f2-8019-86cd27bf3ad7',
  measureImplType: 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN',
  actionPlanEnergyEfficiencyMeasure: {
    measureName: 'M3',
    totalEnergySavingsExpected: {
      total: 45645,
      buildings: 45645,
      transport: 0,
      otherProcesses: 0,
      industrialProcesses: 0,
    },
    estimationMethodDescription: 'Ab ovo 11',
    implementationDateForMeasure: '2025-03-01',
    energySavingsEstimateCalculatedType: 'OTHER_REASONABLE_ESTIMATION_METHOD',
    isEnergySavingsOpportunityReportedInAudit: true,
  },
  progressUpdate1P3EnergyEfficiencyMeasure: {
    estimationMethodType: 'ENERGY_AUDIT',
    measureIsImplemented: true,
    reductionEnergyConsumption2024To2025: 11222,
    measureImplementedByTheDateInActionPlan: true,
  },
};

export const mockProgressUpdate1P3Measure4: ProgressUpdate1P3UpdatedMeasure = {
  uuId: '8d4c20d5-b6b0-4fbf-ad9c-9b919eb2de3e',
  measureImplType: 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN',
  actionPlanEnergyEfficiencyMeasure: {
    measureName: 'M4 (before AP sub)',
    totalEnergySavingsExpected: {
      total: 111,
      buildings: 0,
      transport: 0,
      otherProcesses: 0,
      industrialProcesses: 111,
    },
    implementationDateForMeasure: '2024-01-01',
    energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
    isEnergySavingsOpportunityReportedInAudit: false,
  },
  progressUpdate1P3EnergyEfficiencyMeasure: {
    providedContext: 'DD context',
    estimationMethodType: 'OTHER_METHOD',
    reportReduction2023To2024: true,
    reportReduction2024To2025: true,
    estimationMethodDescription: 'GG other method',
    reductionEnergyConsumption2023To2024: 44444,
    reductionEnergyConsumption2024To2025: 23,
  },
};

export const mockProgressUpdate1P3AddedMeasure1: ProgressUpdate1P3AddedMeasure = {
  measureName: 'A1',
  estimationMethodType: 'ENERGY_AUDIT',
  reductionEnergyConsumption2024To2025: 1,
};

export const mockProgressUpdate1P3AddedMeasure2: ProgressUpdate1P3AddedMeasure = {
  measureName: 'A2',
  measureScheme: [
    'CLIMATE_CHANGE_AGREEMENTS_CCA',
    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
    'UK_EMISSIONS_TRADING_SCHEME_ETS',
    'UN_RACE_TO_ZERO',
    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
    'CARBON_REDUCTION_PLANS',
    'OTHER',
  ],
  estimationMethodType: 'ENERGY_AUDIT',
  otherMeasureSchemeName: 'Other6',
  reductionEnergyConsumption2023To2024: 456,
  reductionEnergyConsumption2024To2025: 123,
  measureContext: 'GG',
};

export const mockProgressUpdate1P3Measures: ProgressUpdate1P3UpdatedMeasure[] = [
  mockProgressUpdate1P3Measure1,
  mockProgressUpdate1P3Measure2,
  mockProgressUpdate1P3Measure3,
  mockProgressUpdate1P3Measure4,
];

export const progressUpdate1P3AddedMeasures: ProgressUpdate1P3AddedMeasure[] = [
  mockProgressUpdate1P3AddedMeasure1,
  mockProgressUpdate1P3AddedMeasure2,
];

export const mockProgressUpdate1P3: ProgressUpdate1P3 = {
  responsibleOfficerConfirmation: mockProgressUpdate1ResponsibleOfficerConfirmation,
  progressUpdate1P3MeasuresUpdate: {
    progressUpdate1P3Measures: mockProgressUpdate1P3Measures,
    progressUpdate1P3AddedMeasure: progressUpdate1P3AddedMeasures,
  },
};

export const mockProgressUpdate1RequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        progressUpdate1P3: mockProgressUpdate1P3,
        progressUpdate1P3SectionsCompleted: {
          progressUpdate1P3MeasuresUpdate: TaskItemStatus.COMPLETED,
          responsibleOfficerConfirmation: TaskItemStatus.COMPLETED,
        },
      } as unknown as ProgressUpdate1TaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof ProgressUpdate1TaskPayload['progressUpdate1P3'], any>>,
  taskStatus?: Partial<Record<keyof ProgressUpdate1TaskPayload['progressUpdate1P3'], TaskItemStatus>>,
): RequestTaskState => {
  return {
    ...mockProgressUpdate1RequestTask,
    requestTaskItem: produce(mockProgressUpdate1RequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as ProgressUpdate1TaskPayload;

      payload.progressUpdate1P3 = { ...payload.progressUpdate1P3, ...data };
      payload.progressUpdate1P3SectionsCompleted = { ...payload.progressUpdate1P3SectionsCompleted, ...taskStatus };
    }),
  };
};

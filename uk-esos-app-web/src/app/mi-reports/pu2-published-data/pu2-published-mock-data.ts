import { ProgressUpdate2PublishedDataResult } from './pu2-published-data.interfaces';

export const mockProgressUpdate2PublishedDataResult: ProgressUpdate2PublishedDataResult = {
  progressUpdate2SearchResultsInfos: [
    {
      pu2Id: 'PU2000005-P3',
      organisationName: 'The Org IM4',
      registrationNumber: '12580944',
      pu2SubmitDate: '2025-04-02T21:41:46.086469Z',
      actionPlanId: 'AP000005-P3',
      actionPlanSubmitDate: '2024-11-27T11:20:17.175317Z',
      pu1Id: 'PU1000005-P3',
      pu1SubmitDate: '2025-04-02T21:39:13.297288Z',
      location: 'ENGLAND',
      progressUpdate2Container: {
        phase: 'PHASE_3',
        progressUpdate2P3: {
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [],
            progressUpdate2P3UpdatedAddedMeasures: [
              {
                uuId: '698c8f81-8349-41af-9c2e-c7a23040f2e1',
                progressUpdate1P3AddedMeasure: {
                  measureName: 'N1',
                  measureScheme: ['STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR', 'CLIMATE_CHANGE_AGREEMENTS_CCA'],
                  reductionEnergyConsumption2024To2025: 22,
                  estimationMethodType: 'ENERGY_AUDIT',
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: true,
                  reductionEnergyConsumption2025To2026: 33,
                  estimationMethodType: 'ENERGY_AUDIT',
                  providedContext: 'Strawberry, blueberry',
                },
              },
            ],
            progressUpdate2P3AddedMeasure: [
              {
                measureName: 'New PU2 measure F',
                measureScheme: [
                  'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                  'UK_EMISSIONS_TRADING_SCHEME_ETS',
                  'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                  'CARBON_REDUCTION_PLANS',
                  'CLIMATE_CHANGE_AGREEMENTS_CCA',
                  'UN_RACE_TO_ZERO',
                  'OTHER',
                ],
                otherMeasureSchemeName: 'GG55',
                reductionEnergyConsumption2025To2026: 333,
                estimationMethodType: 'NO_METHOD_USED',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
    {
      pu2Id: 'PU2000006-P3',
      organisationName: 'The Org VI',
      registrationNumber: '12580945',
      pu2SubmitDate: '2025-03-14T12:29:27.860869Z',
      actionPlanId: 'AP000006-P3',
      actionPlanSubmitDate: '2025-01-03T14:17:50.917376Z',
      pu1Id: 'PU1000006-P3',
      pu1SubmitDate: '2025-03-06T17:01:36.298865Z',
      location: 'ENGLAND',
      progressUpdate2Container: {
        phase: 'PHASE_3',
        progressUpdate2P3: {
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [
              {
                uuId: 'fcf39f00-7b64-40cd-809d-cb1a15d9cbc9',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'Dorem! (before AP sub)',
                  isEnergySavingsOpportunityReportedInAudit: true,
                  measureScheme: [
                    'UK_EMISSIONS_TRADING_SCHEME_ETS',
                    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                    'CARBON_REDUCTION_PLANS',
                    'UN_RACE_TO_ZERO',
                    'CLIMATE_CHANGE_AGREEMENTS_CCA',
                    'OTHER',
                  ],
                  otherMeasureSchemeName: 'Other6 frfrfr',
                  totalEnergySavingsExpected: {
                    buildings: 233,
                    transport: 0,
                    industrialProcesses: 3232,
                    otherProcesses: 0,
                    total: 3465,
                  },
                  implementationDateForMeasure: '2024-10-01',
                  energySavingsEstimateCalculatedType: 'ALTERNATIVE_COMPLIANCE_METHOD',
                  measureContext: 'Das kontekst',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  reductionEnergyConsumption2024To2025: 1111,
                  estimationMethodType: 'ENERGY_AUDIT',
                  providedContext: 'Some ctx',
                  reportReduction2024To2025: true,
                  reportReduction2023To2024: false,
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: false,
                },
              },
              {
                uuId: '0d8987dd-7554-4a39-a06a-8afa83f7f66c',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'M22',
                  isEnergySavingsOpportunityReportedInAudit: false,
                  measureScheme: ['UK_EMISSIONS_TRADING_SCHEME_ETS', 'UN_RACE_TO_ZERO'],
                  totalEnergySavingsExpected: {
                    buildings: 3,
                    transport: 4,
                    industrialProcesses: 5,
                    otherProcesses: 66,
                    total: 78,
                  },
                  implementationDateForMeasure: '2026-02-01',
                  energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: false,
                  providedContext: 'Not yet friends',
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: true,
                  measureImplementedByTheDateInActionPlan: true,
                  reductionEnergyConsumption2025To2026: 111,
                  estimationMethodType: 'ACTION_PLAN_ESTIMATE',
                },
              },
              {
                uuId: '0a7d493b-7db3-4b83-a8d4-a0563cc6ff08',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'M3',
                  isEnergySavingsOpportunityReportedInAudit: true,
                  totalEnergySavingsExpected: {
                    buildings: 45645,
                    transport: 0,
                    industrialProcesses: 0,
                    otherProcesses: 0,
                    total: 45645,
                  },
                  implementationDateForMeasure: '2025-03-01',
                  energySavingsEstimateCalculatedType: 'OTHER_REASONABLE_ESTIMATION_METHOD',
                  estimationMethodDescription: 'Ab ovo 11',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: true,
                  measureImplementedByTheDateInActionPlan: false,
                  reductionEnergyConsumption2024To2025: 22222,
                  reductionEnergyConsumption2023To2024: 343,
                  estimationMethodType: 'ACTION_PLAN_ESTIMATE',
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: false,
                },
              },
              {
                uuId: '72c89df1-d5df-4f56-903e-93142c12ccb4',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'M4 (before AP sub)',
                  isEnergySavingsOpportunityReportedInAudit: false,
                  totalEnergySavingsExpected: {
                    buildings: 0,
                    transport: 0,
                    industrialProcesses: 111,
                    otherProcesses: 0,
                    total: 111,
                  },
                  implementationDateForMeasure: '2024-01-01',
                  energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  reportReduction2024To2025: false,
                  reportReduction2023To2024: false,
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: true,
                  reductionEnergyConsumption2025To2026: 222,
                  estimationMethodType: 'ENERGY_AUDIT',
                },
              },
            ],
            progressUpdate2P3UpdatedAddedMeasures: [
              {
                uuId: '0a3f6ba8-9cf5-4ec4-b950-f4582f596049',
                progressUpdate1P3AddedMeasure: {
                  measureName: 'New PU1 measure A',
                  measureScheme: [
                    'UK_EMISSIONS_TRADING_SCHEME_ETS',
                    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                    'CARBON_REDUCTION_PLANS',
                    'UN_RACE_TO_ZERO',
                    'CLIMATE_CHANGE_AGREEMENTS_CCA',
                    'OTHER',
                  ],
                  otherMeasureSchemeName: 'Fooboo',
                  reductionEnergyConsumption2024To2025: 3453,
                  estimationMethodType: 'OTHER_METHOD',
                  estimationMethodDescription: 'GGm',
                  measureContext: 'New msr ctx',
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: false,
                },
              },
              {
                uuId: '754f5bb8-dccc-46f9-9f30-cf2975d7dd2e',
                progressUpdate1P3AddedMeasure: {
                  measureName: 'New PU1 measure B',
                  reductionEnergyConsumption2024To2025: 112,
                  estimationMethodType: 'NO_METHOD_USED',
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  reportReduction2025To2026: false,
                },
              },
            ],
            progressUpdate2P3AddedMeasure: [
              {
                measureName: 'AA',
                measureScheme: [
                  'UK_EMISSIONS_TRADING_SCHEME_ETS',
                  'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                  'UN_RACE_TO_ZERO',
                ],
                reductionEnergyConsumption2025To2026: 123,
                estimationMethodType: 'OTHER_METHOD',
                estimationMethodDescription: 'FF',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE', 'ESTIMATION_METHOD_DOCUMENTED'],
        },
      },
    },
    {
      pu2Id: 'PU2000008-P3',
      organisationName: 'The 8th DisORG',
      registrationNumber: '12580946',
      pu2SubmitDate: '2025-04-02T14:57:30.226749Z',
      location: 'ENGLAND',
      progressUpdate2Container: {
        phase: 'PHASE_3',
        progressUpdate2P3: {
          groupChange: {
            otherResponsibleUndertakingName: 'The other RU',
            otherResponsibleUndertakingCrn: '678686',
          },
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [],
            progressUpdate2P3UpdatedAddedMeasures: [],
            progressUpdate2P3AddedMeasure: [],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
    {
      pu2Id: 'PU2000010-P3',
      organisationName: '10th ORG',
      pu2SubmitDate: '2025-03-14T12:44:53.763589Z',
      actionPlanId: 'AP000010-P3',
      actionPlanSubmitDate: '2025-03-14T12:43:41.916745Z',
      pu1Id: 'PU1000010-P3',
      pu1SubmitDate: '2025-03-14T12:44:05.907014Z',
      location: 'ENGLAND',
      progressUpdate2Container: {
        phase: 'PHASE_3',
        progressUpdate2P3: {
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [
              {
                uuId: '542342e3-dcc1-4654-a72e-3b27e5696376',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'M1',
                  isEnergySavingsOpportunityReportedInAudit: true,
                  measureScheme: ['STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR'],
                  totalEnergySavingsExpected: {
                    buildings: 1222,
                    transport: 0,
                    industrialProcesses: 0,
                    otherProcesses: 0,
                    total: 1222,
                  },
                  implementationDateForMeasure: '2026-01-01',
                  energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: false,
                },
                progressUpdate2P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: true,
                  measureImplementedByTheDateInActionPlan: true,
                  reductionEnergyConsumption2025To2026: 12324,
                  estimationMethodType: 'ACTION_PLAN_ESTIMATE',
                },
              },
            ],
            progressUpdate2P3UpdatedAddedMeasures: [],
            progressUpdate2P3AddedMeasure: [],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
  ],
};

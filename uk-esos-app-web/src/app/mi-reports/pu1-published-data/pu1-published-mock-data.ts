import { ProgressUpdate1PublishedDataResult } from './pu1-published-data.interfaces';

export const mockProgressUpdate1PublishedDataResult: ProgressUpdate1PublishedDataResult = {
  progressUpdate1SearchResultsInfos: [
    {
      pu1Id: 'PU1000005-P3',
      organisationName: 'The Org 4',
      registrationNumber: '12580944',
      pu1SubmitDate: '2025-03-12T16:26:29.356812Z',
      actionPlanId: 'AP000005-P3',
      actionPlanSubmitDate: '2024-11-27T11:20:17.175317Z',
      location: 'ENGLAND',
      progressUpdate1Container: {
        phase: 'PHASE_3',
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [],
            progressUpdate1P3AddedMeasure: [
              {
                measureName: 'N1',
                measureScheme: ['STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR', 'CLIMATE_CHANGE_AGREEMENTS_CCA'],
                reductionEnergyConsumption2024To2025: 22,
                estimationMethodType: 'ENERGY_AUDIT',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
    {
      pu1Id: 'PU1000006-P3',
      organisationName: 'The Org VI',
      registrationNumber: '12580945',
      pu1SubmitDate: '2025-03-06T17:01:36.298865Z',
      actionPlanId: 'AP000006-P3',
      actionPlanSubmitDate: '2025-01-03T14:17:50.917376Z',
      location: 'ENGLAND',
      progressUpdate1Container: {
        phase: 'PHASE_3',
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [
              {
                uuId: '89277a9d-9c12-49a4-992e-2064db745029',
                measureImplType: 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN',
                actionPlanEnergyEfficiencyMeasure: {
                  measureName: 'Msr name (before AP sub)',
                  isEnergySavingsOpportunityReportedInAudit: true,
                  measureScheme: [
                    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                    'UK_EMISSIONS_TRADING_SCHEME_ETS',
                    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                    'CARBON_REDUCTION_PLANS',
                    'CLIMATE_CHANGE_AGREEMENTS_CCA',
                    'UN_RACE_TO_ZERO',
                    'OTHER',
                  ],
                  otherMeasureSchemeName: 'Other6 lorem ipsum',
                  totalEnergySavingsExpected: {
                    buildings: 233,
                    transport: 0,
                    industrialProcesses: 3232,
                    otherProcesses: 0,
                    total: 3465,
                  },
                  implementationDateForMeasure: '2024-10-01',
                  energySavingsEstimateCalculatedType: 'ALTERNATIVE_COMPLIANCE_METHOD',
                  measureContext: 'Ipsum lorem kontekst',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  reductionEnergyConsumption2024To2025: 1111,
                  estimationMethodType: 'ENERGY_AUDIT',
                  providedContext: 'Some ctx',
                  reportReduction2024To2025: true,
                  reportReduction2023To2024: false,
                },
              },
              {
                uuId: '02e5f390-36ac-490c-92aa-6f1442f458d5',
                measureImplType: 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN',
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
                  providedContext: 'Not yet implemented context',
                },
              },
              {
                uuId: 'ef88f132-b5a7-4514-9647-8f7fe555c440',
                measureImplType: 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN',
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
                  estimationMethodDescription: 'Reasonable estimate desc.11',
                },
                progressUpdate1P3EnergyEfficiencyMeasure: {
                  measureIsImplemented: true,
                  measureImplementedByTheDateInActionPlan: false,
                  reductionEnergyConsumption2024To2025: 22222,
                  reductionEnergyConsumption2023To2024: 343,
                  estimationMethodType: 'ACTION_PLAN_ESTIMATE',
                },
              },
              {
                uuId: '6832f344-0fba-4caf-ae3c-a039a5d2014f',
                measureImplType: 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN',
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
              },
            ],
            progressUpdate1P3AddedMeasure: [
              {
                measureName: 'New PU1 measure A',
                measureScheme: [
                  'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                  'UK_EMISSIONS_TRADING_SCHEME_ETS',
                  'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                  'CARBON_REDUCTION_PLANS',
                  'CLIMATE_CHANGE_AGREEMENTS_CCA',
                  'UN_RACE_TO_ZERO',
                  'OTHER',
                ],
                otherMeasureSchemeName: 'Grapes Vines Scheme',
                reductionEnergyConsumption2024To2025: 3453,
                estimationMethodType: 'OTHER_METHOD',
                estimationMethodDescription: 'GG. Description.',
                measureContext: 'New msr ctx',
              },
              {
                measureName: 'New PU1 measure B',
                reductionEnergyConsumption2024To2025: 112,
                estimationMethodType: 'NO_METHOD_USED',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE', 'ESTIMATION_METHOD_DOCUMENTED'],
        },
      },
    },
    {
      pu1Id: 'PU1000010-P3',
      organisationName: '10th ORG',
      registrationNumber: '12580946',
      pu1SubmitDate: '2025-03-14T12:44:05.907014Z',
      actionPlanId: 'AP000010-P3',
      actionPlanSubmitDate: '2025-03-14T12:43:41.916745Z',
      location: 'ENGLAND',
      progressUpdate1Container: {
        phase: 'PHASE_3',
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [
              {
                uuId: 'ffb4a0dc-8b93-4cf1-8d93-39c3ce6aaa1e',
                measureImplType: 'MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN',
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
              },
            ],
            progressUpdate1P3AddedMeasure: [],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
    {
      pu1Id: 'PU1000011-P3',
      organisationName: 'The 11 DisOrg PU1',
      pu1SubmitDate: '2025-04-02T14:52:25.180664Z',
      location: 'ENGLAND',
      progressUpdate1Container: {
        phase: 'PHASE_3',
        progressUpdate1P3: {
          groupChange: {
            otherResponsibleUndertakingName: 'Old RU group name',
            otherResponsibleUndertakingCrn: '12334',
          },
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [],
            progressUpdate1P3AddedMeasure: [
              {
                measureName: 'DU New Msr 1',
                measureScheme: ['CARBON_REDUCTION_PLANS', 'OTHER'],
                otherMeasureSchemeName: 'Apple pear cherry',
                reductionEnergyConsumption2024To2025: 1232,
                reductionEnergyConsumption2023To2024: 43454,
                estimationMethodType: 'NO_METHOD_USED',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ACTION_PLAN_COMPLIANCE'],
        },
      },
    },
  ],
};

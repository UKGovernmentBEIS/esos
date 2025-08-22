import { ActionPlanPublishedDataResult } from './action-plan-published-data.interfaces';

export const mockActionPlanPublishedDataResult: ActionPlanPublishedDataResult = {
  actionPlanSearchResultsInfos: [
    {
      actionPlanId: 'AP000003-P3',
      organisationName: 'The Org 000',
      location: 'ENGLAND',
      actionPlanContainer: {
        phase: 'PHASE_3',
        actionPlan: {
          energyEfficiencyMeasure: {
            haveEnergyEfficiencyMeasures: false,
            energyEfficiencyMeasures: [],
          },
          responsibleOfficerConfirmation: ['ESOS_ASSESSMENT_NOTIFICATION'],
        },
      },
    },
    {
      actionPlanId: 'AP000004-P3',
      nocId: 'NOC000004-P3',
      organisationName: 'The Org 00',
      nocSubmitDate: '2024-10-16T11:18:42.821745Z',
      actionPlanSubmitDate: '2024-10-04T18:08:26.237708Z',
      location: 'ENGLAND',
      actionPlanContainer: {
        phase: 'PHASE_3',
        actionPlan: {
          energyEfficiencyMeasure: {
            haveEnergyEfficiencyMeasures: true,
            energyEfficiencyMeasures: [
              {
                measureName: 'Lorem ipsum III',
                isEnergySavingsOpportunityReportedInAudit: true,
                measureScheme: ['STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR', 'UN_RACE_TO_ZERO'],
                totalEnergySavingsExpected: {
                  buildings: 1,
                  transport: 2,
                  industrialProcesses: 0,
                  otherProcesses: 0,
                  total: 3,
                },
                implementationDateForMeasure: '2024-03-01',
                energySavingsEstimateCalculatedType: 'OTHER_REASONABLE_ESTIMATION_METHOD',
                estimationMethodDescription: 'The other method name',
                measureContext: 'Post nubila phoebus',
              },
              {
                measureName: 'Lorem ipsum 44',
                isEnergySavingsOpportunityReportedInAudit: false,
                totalEnergySavingsExpected: {
                  buildings: 1,
                  transport: 2,
                  industrialProcesses: 0,
                  otherProcesses: 4444,
                  total: 4447,
                },
                implementationDateForMeasure: '2026-02-01',
                energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESTIMATION_METHOD_DESCRIPTION', 'ESOS_ASSESSMENT_NOTIFICATION'],
        },
      },
    },
    {
      actionPlanId: 'AP000005-P3',
      organisationName: 'The Org IM4',
      registrationNumber: '12580944',
      actionPlanSubmitDate: '2024-11-27T11:20:17.175317Z',
      location: 'ENGLAND',
      actionPlanContainer: {
        phase: 'PHASE_3',
        actionPlan: {
          energyEfficiencyMeasure: {
            haveEnergyEfficiencyMeasures: false,
            noMeasureContext: 'This is the no measure context',
            energyEfficiencyMeasures: [],
          },
          responsibleOfficerConfirmation: ['ESOS_ASSESSMENT_NOTIFICATION'],
        },
      },
    },
    {
      actionPlanId: 'AP000006-P3',
      organisationName: 'The Org VI',
      actionPlanSubmitDate: '2024-11-27T14:47:10.4632Z',
      location: 'ENGLAND',
      actionPlanContainer: {
        phase: 'PHASE_3',
        actionPlan: {
          energyEfficiencyMeasure: {
            haveEnergyEfficiencyMeasures: true,
            energyEfficiencyMeasures: [
              {
                measureName: 'Dorem!',
                isEnergySavingsOpportunityReportedInAudit: true,
                measureScheme: [
                  'CLIMATE_CHANGE_AGREEMENTS_CCA',
                  'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
                  'OTHER',
                  'UK_EMISSIONS_TRADING_SCHEME_ETS',
                  'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
                  'CARBON_REDUCTION_PLANS',
                  'UN_RACE_TO_ZERO',
                ],
                otherMeasureSchemeName: 'The Other scheme name',
                totalEnergySavingsExpected: {
                  buildings: 233,
                  transport: 0,
                  industrialProcesses: 3232,
                  otherProcesses: 0,
                  total: 3465,
                },
                implementationDateForMeasure: '2025-12-01',
                energySavingsEstimateCalculatedType: 'ALTERNATIVE_COMPLIANCE_METHOD',
                measureContext: 'Another measure context string',
              },
            ],
          },
          responsibleOfficerConfirmation: ['ESOS_ASSESSMENT_NOTIFICATION'],
        },
      },
    },
  ],
};

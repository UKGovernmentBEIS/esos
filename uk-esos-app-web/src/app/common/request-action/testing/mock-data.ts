import { RequestActionState } from '@common/request-action/+state';

import { NotificationOfComplianceP3ApplicationRequestActionPayload, RequestActionDTO } from 'esos-api';

const mockNotificationPayload: NotificationOfComplianceP3ApplicationRequestActionPayload = {
  payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED_PAYLOAD',
  noc: {
    reportingObligation: {
      qualificationType: 'QUALIFY',
      reportingObligationDetails: {
        qualificationReasonType: 'TURNOVER_MORE_THAN_44M',
        energyResponsibilityType: 'RESPONSIBLE',
        complianceRouteDistribution: {
          iso50001Pct: 40,
          displayEnergyCertificatePct: 30,
          greenDealAssessmentPct: 20,
          energyAuditsPct: 10,
          energyNotAuditedPct: 0,
          totalPct: 100,
        },
      },
    },
    responsibleUndertaking: {
      organisationDetails: {
        name: 'COMPANY 23',
        registrationNumberExist: true,
        registrationNumber: '36239417',
        line1: 'Companies House',
        line2: 'Crownway',
        city: 'Cardiff',
        postcode: 'CF14 3UZ',
        type: 'SIC',
        codes: ['71200'],
      },
      tradingDetails: {
        exist: false,
      },
      organisationContactDetails: {
        email: 'organisation23@mail.com',
        phoneNumber: {
          countryCode: '44',
          number: '1234567890',
        },
      },
      isBehalfOfTrust: false,
      hasOverseasParentDetails: false,
    },
    contactPersons: {
      primaryContact: {
        firstName: 'Operator1',
        lastName: 'England',
        phoneNumber: {
          countryCode: '44',
          number: '2071234567',
        },
        mobileNumber: {},
        email: '1@o.com',
        line1: 'Some address',
        city: 'London',
        postcode: '55555',
      },
      hasSecondaryContact: false,
    },
    organisationStructure: {
      isHighestParent: false,
      isNonComplyingUndertakingsIncluded: false,
      isGroupStructureChartProvided: false,
    },
    complianceRoute: {
      estimatedCalculationTypes: ['TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION'],
      areTwelveMonthsVerifiableDataUsed: false,
      twelveMonthsVerifiableDataUsedReason: 'asdf',
      areEstimationMethodsRecorded: 'SKIP_QUESTION',
      energyConsumptionProfilingUsed: 'NOT_APPLICABLE',
      isEnergyConsumptionProfilingNotUsedRecorded: 'SKIP_QUESTION',
      energyAudits: [
        {
          description: 'asdf',
          numberOfSitesCovered: 3,
          numberOfSitesVisited: 3,
          reason: 'Reason why are the sites visited for the energy audit',
        },
      ],
      partsProhibitedFromDisclosingExist: false,
    },
    energyConsumptionDetails: {
      totalEnergyConsumption: {
        buildings: 40,
        transport: 30,
        industrialProcesses: 20,
        otherProcesses: 10,
        total: 100,
      },
      significantEnergyConsumptionExists: false,
      energyIntensityRatioData: {
        buildings: {
          energyIntensityRatios: [
            {
              ratio: '30',
              unit: '1',
            },
          ],
        },
        transport: {
          energyIntensityRatios: [
            {
              ratio: '12',
              unit: '1',
            },
          ],
        },
        industrialProcesses: {
          energyIntensityRatios: [
            {
              ratio: '30',
              unit: '1',
            },
          ],
        },
        otherProcesses: {
          energyIntensityRatios: [
            {
              ratio: '10',
              unit: '1',
            },
          ],
        },
      },
      additionalInformationExists: false,
    },
    energySavingsOpportunities: {
      implementationEnergyConsumption: {
        energyConsumption: 10,
        energyCost: '1.00',
      },
      energyConsumption: {
        buildings: {
          energyConsumption: 40,
          energyCost: '1.00',
        },
        transport: {
          energyConsumption: 30,
          energyCost: '1.00',
        },
        industrialProcesses: {
          energyConsumption: 20,
          energyCost: '1.00',
        },
        otherProcesses: {
          energyConsumption: 10,
          energyCost: '1.00',
        },
        energyConsumptionTotal: 100,
        energyCostTotal: '4.00',
      },
      energySavingsCategories: {
        energyManagementPractices: {},
        behaviourChangeInterventions: {},
        training: {},
        controlsImprovements: {},
        capitalInvestments: {},
        otherMeasures: {},
      },
    },
    alternativeComplianceRoutes: {
      totalEnergyConsumptionReduction: {
        energyConsumption: 10,
        energyCost: '1.00',
      },
      energyConsumptionReduction: {
        buildings: {
          energyConsumption: 40,
          energyCost: '1.00',
        },
        transport: {
          energyConsumption: 30,
          energyCost: '1.00',
        },
        industrialProcesses: {
          energyConsumption: 20,
          energyCost: '1.00',
        },
        otherProcesses: {
          energyConsumption: 10,
          energyCost: '1.00',
        },
        energyConsumptionTotal: 100,
        energyCostTotal: '4.00',
      },
      energyConsumptionReductionCategories: {
        energyManagementPractices: {
          energyConsumption: 80,
          energyCost: '1.00',
        },
        behaviourChangeInterventions: {
          energyConsumption: 70,
          energyCost: '1.00',
        },
        training: {
          energyConsumption: 60,
          energyCost: '1.00',
        },
        controlsImprovements: {
          energyConsumption: 50,
          energyCost: '1.00',
        },
        capitalInvestments: {
          energyConsumption: 40,
          energyCost: '1.00',
        },
        otherMeasures: {
          energyConsumption: 30,
          energyCost: '1.00',
        },
        energyConsumptionTotal: 330,
        energyCostTotal: '6.00',
      },
      assets: {
        iso50001: 'iso50001',
        dec: 'dec',
        gda: 'gda',
      },
      iso50001CertificateDetails: {},
      decCertificatesDetails: {
        certificateDetails: [{}],
      },
      gdaCertificatesDetails: {
        certificateDetails: [{}],
      },
    },
    energySavingsAchieved: {
      energySavingsEstimation: {
        buildings: 40,
        transport: 30,
        industrialProcesses: 20,
        otherProcesses: 10,
        total: 100,
      },
      energySavingCategoriesExist: 'SKIP_QUESTION',
      energySavingsRecommendationsExist: 'SKIP_QUESTION',
      details: 'asdf',
    },
    leadAssessor: {
      leadAssessorType: 'INTERNAL',
      hasLeadAssessorConfirmation: true,
      leadAssessorDetails: {
        firstName: 'LeadAccessorFirstName',
        lastName: 'LeadAccessorLastName',
        email: 'leadaccessor@mail.com',
        professionalBody: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
        membershipNumber: '1111111',
      },
    },
    assessmentPersonnel: {
      personnel: [
        {
          firstName: 'Gerpis',
          lastName: 'Erpis',
          type: 'INTERNAL',
        },
      ],
    },
    secondCompliancePeriod: {
      informationExists: 'SKIP_QUESTION',
    },
    firstCompliancePeriod: {
      informationExists: 'SKIP_QUESTION',
    },
    confirmations: {
      responsibilityAssessmentTypes: [
        'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
        'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
        'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
        'SATISFIED_WITH_INFORMATION_PROVIDED',
      ],
      responsibleOfficerDetails: {
        firstName: 'LeadAccessorFirstName',
        lastName: 'LeadAccessorLastName',
        jobTitle: 'ResponsibleOfficer',
        phoneNumber: {
          countryCode: '44',
          number: '1234567890',
        },
        mobileNumber: {},
        email: 'responsible@mail.com',
        line1: 'Some address',
        city: 'London',
        postcode: '55555',
      },
      reviewAssessmentDate: '2022-01-01',
      secondResponsibleOfficerEnergyTypes: [
        'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
        'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
        'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
        'SATISFIED_WITH_INFORMATION_PROVIDED',
      ],
      secondResponsibleOfficerDetails: {
        firstName: 'Responsible2First',
        lastName: 'Responsible2Last',
        jobTitle: 'Responsible Officer',
        phoneNumber: {
          countryCode: '44',
          number: '1234567890',
        },
        mobileNumber: {},
        email: 'responsible2first@mail.com',
        line1: 'Some address',
        city: 'London',
        postcode: '55555',
      },
    },
  },
  accountOriginatedData: {
    organisationDetails: {
      city: 'London',
      county: 'Cardiff',
      line1: 'Line 1',
      line2: 'Line 2',
      name: 'Company Org Name',
      postcode: 'Postcode',
      type: 'OTHER',
      otherTypeName: 'some classification name',
      codes: ['CodeA', 'CodeB', 'CodeC'],
    },
  },
};

export const mockRequestActionNocP3SubmittedState: RequestActionState = {
  action: {
    id: 56,
    type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED',
    payload: mockNotificationPayload,
    requestId: 'NOC000015-P3',
    requestType: 'NOTIFICATION_OF_COMPLIANCE_P3',
    requestAccountId: 15,
    competentAuthority: 'ENGLAND',
    submitter: 'Operator1 England',
    creationDate: '2024-04-29T11:26:48.735269Z',
  } as RequestActionDTO,
};

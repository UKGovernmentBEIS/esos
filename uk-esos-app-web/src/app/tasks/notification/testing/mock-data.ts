import { RequestTaskState } from '@common/request-task/+state';
import { mockRequestTask } from '@common/request-task/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import {
  AlternativeComplianceRoutes,
  AssessmentPersonnel,
  ComplianceRoute,
  Confirmations,
  ContactPersons,
  EnergyConsumption,
  EnergyConsumptionDetails,
  EnergySavingsAchieved,
  EnergySavingsOpportunities,
  FirstCompliancePeriod,
  FirstCompliancePeriodDetails,
  LeadAssessor,
  OrganisationStructure,
  ResponsibleUndertaking,
  SecondCompliancePeriod,
  SignificantEnergyConsumption,
} from 'esos-api';

import { NotificationTaskPayload } from '../notification.types';

export const mockContactPersons: ContactPersons = {
  primaryContact: {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },

  hasSecondaryContact: true,
  secondaryContact: {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
};

export const mockNotificationTaskPayload: NotificationTaskPayload = {
  noc: {
    assessmentPersonnel: {
      personnel: [
        {
          firstName: 'John',
          lastName: 'Doe',
          type: 'INTERNAL',
        },
        {
          firstName: 'John',
          lastName: 'Smith',
          type: 'EXTERNAL',
        },
      ],
    },
    leadAssessor: {
      leadAssessorType: 'EXTERNAL',
      hasLeadAssessorConfirmation: true,
      leadAssessorDetails: {
        firstName: 'Mike',
        lastName: 'Btiste',
        email: 'dpg@media.com',
        professionalBody: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
        membershipNumber: '13',
      },
    },
    reportingObligation: {
      qualificationType: 'QUALIFY',
      reportingObligationDetails: {
        qualificationReasonType: null,
        energyResponsibilityType: 'RESPONSIBLE',
      },
    },
  },
};

export const mockAssessmentPersonnel: AssessmentPersonnel = {
  personnel: [
    {
      firstName: 'John',
      lastName: 'Doe',
      type: 'INTERNAL',
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      type: 'EXTERNAL',
    },
  ],
};

export const mockEnergySavingOpportunities: EnergySavingsOpportunities = {
  implementationEnergyConsumption: {
    energyConsumption: 100,
    energyCost: '2.00',
  },
  energyConsumption: {
    buildings: { energyConsumption: 2, energyCost: '2.00' },
    transport: { energyConsumption: 4, energyCost: '2.00' },
    industrialProcesses: { energyConsumption: 9, energyCost: '4.45' },
    otherProcesses: { energyConsumption: 13, energyCost: '110.60' },
    energyConsumptionTotal: 28,
    energyCostTotal: '117.05',
  },
  energySavingsCategories: {
    energyManagementPractices: { energyConsumption: 1, energyCost: '1.00' },
    behaviourChangeInterventions: { energyConsumption: 2, energyCost: '2.20' },
    training: { energyConsumption: 3, energyCost: '3.03' },
    controlsImprovements: { energyConsumption: 4, energyCost: '4.00' },
    capitalInvestments: { energyConsumption: 6, energyCost: '4.00' },
    otherMeasures: { energyConsumption: 7, energyCost: '4.00' },
    energyConsumptionTotal: 28,
    energyCostTotal: '6.23',
  },
};

export const mockResponsibleUndertaking: ResponsibleUndertaking = {
  organisationDetails: {
    registrationNumberExist: true,
    registrationNumber: 'AB123456',
    name: 'Corporate Legal Entity Account 2',
    line1: 'Some address 1',
    line2: 'Some address 2',
    city: 'London',
    county: 'London',
    postcode: '511111',
    type: 'OTHER',
    otherTypeName: 'some classification name',
    codes: ['CodeA', 'CodeB', 'CodeC'],
  },
  tradingDetails: {
    exist: true,
    tradingName: 'Trading name',
  },
  organisationContactDetails: {
    email: '1@o.com',
    phoneNumber: {
      countryCode: '44',
      number: '02071234567',
    },
  },
  isBehalfOfTrust: true,
  trustName: 'Trust name',
  hasOverseasParentDetails: true,
  overseasParentDetails: {
    name: 'Parent company name',
    tradingName: 'Parent company trading name',
  },
};

export const mockOrganisationStructure: OrganisationStructure = {
  isHighestParent: true,
  isNonComplyingUndertakingsIncluded: true,
  organisationUndertakingDetails: [
    {
      organisationName: 'First undertaking',
      registrationNumber: '11111111',
    },
    {
      organisationName: 'Second undertaking',
      registrationNumber: '2222222',
    },
  ],
  organisationsAssociatedWithRU: [
    {
      registrationNumberExist: true,
      registrationNumber: '00000000',
      hasCeasedToBePartOfGroup: true,
      classificationCodesDetails: {
        areSameAsRU: false,
        codes: {
          type: 'SIC',
          codes: ['111111'],
        },
      },
      isParentOfResponsibleUndertaking: true,
      isPartOfArrangement: true,
      isPartOfFranchise: false,
      isSubsidiaryOfResponsibleUndertaking: false,
      organisationName: 'Organisation name',
    },
  ],
  isGroupStructureChartProvided: true,
};

export const mockEnergySavingsAchieved: EnergySavingsAchieved = {
  details: 'lorem ipsum',
  energySavingCategoriesExist: 'YES',
  energySavingsCategories: {
    energyManagementPractices: 0,
    behaviourChangeInterventions: 0,
    training: 0,
    controlsImprovements: 0,
    capitalInvestments: 0,
    otherMeasures: 0,
    total: 0,
  },
  energySavingsEstimation: {
    buildings: 0,
    transport: 0,
    industrialProcesses: 0,
    otherProcesses: 0,
    total: 0,
  },
  energySavingsRecommendationsExist: 'YES',
  energySavingsRecommendations: {
    energyAudits: 0,
    alternativeComplianceRoutes: 0,
    other: 0,
    total: 0,
  },
};

export const mockEnergySavingsAchievedWithTotalEstimate: EnergySavingsAchieved = {
  details: 'lorem ipsum',
  energySavingsRecommendationsExist: 'YES',
  energySavingsRecommendations: {
    energyAudits: 0,
    alternativeComplianceRoutes: 0,
    other: 0,
    total: 0,
  },
  totalEnergySavingsEstimation: 100,
};

export const mockLeadAssessor: LeadAssessor = {
  leadAssessorType: 'EXTERNAL',
  hasLeadAssessorConfirmation: true,
  leadAssessorDetails: {
    firstName: 'Mike',
    lastName: 'Batiste',
    email: 'dpg@media.com',
    professionalBody: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
    membershipNumber: '13',
  },
};

export const mockEnergyConsumptionDetails: EnergyConsumptionDetails = {
  totalEnergyConsumption: {
    buildings: 100,
    transport: 0,
    industrialProcesses: 50,
    otherProcesses: 0,
    total: 150,
  },
  significantEnergyConsumptionExists: true,
  significantEnergyConsumption: {
    buildings: 100,
    transport: 0,
    industrialProcesses: 45,
    otherProcesses: 0,
    total: 145,
    significantEnergyConsumptionPct: 96,
  },
  energyIntensityRatioData: {
    buildings: {
      energyIntensityRatios: [{ ratio: '50', unit: 'm2' }],
      additionalInformation: 'Buildings additional information',
    },
    transport: {
      energyIntensityRatios: [{ ratio: '60', unit: 'm2' }],
      additionalInformation: 'Transport additional information',
    },
    industrialProcesses: {
      energyIntensityRatios: [{ ratio: '70', unit: 'm2' }],
      additionalInformation: 'Industrial processes additional information',
    },
    otherProcesses: {
      energyIntensityRatios: [{ ratio: '80', unit: 'm2' }],
      additionalInformation: 'Other processes additional information',
    },
  },
  additionalInformationExists: true,
  additionalInformation: 'Additional info',
};

export const mockComplianceRoute: ComplianceRoute = {
  estimatedCalculationTypes: ['TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION'],
  areTwelveMonthsVerifiableDataUsed: false,
  twelveMonthsVerifiableDataUsedReason: 'reason1',
  areEstimationMethodsRecorded: 'YES',
  energyConsumptionProfilingUsed: 'NO',
  isEnergyConsumptionProfilingNotUsedRecorded: 'SKIP_QUESTION',
  energyAudits: [
    {
      description: 'desc1',
      numberOfSitesCovered: 5,
      numberOfSitesVisited: 10,
      reason: 'reason1',
    },
    {
      description: 'desc2',
      numberOfSitesVisited: 999,
      reason: 'reason2',
    },
  ],
  partsProhibitedFromDisclosingExist: true,
  partsProhibitedFromDisclosing: 'parts',
  partsProhibitedFromDisclosingReason: 'reason2',
};

export const mockSignificantEnergyConsumption: SignificantEnergyConsumption = {
  buildings: 5000,
  transport: 3000,
  industrialProcesses: 2000,
  otherProcesses: 1000,
  total: 11000,
  significantEnergyConsumptionPct: 25,
};

export const mockEnergyConsumptionBreakdown: EnergyConsumption = {
  buildings: 4000,
  transport: 2500,
  industrialProcesses: 1500,
  otherProcesses: 800,
  total: 8800,
};

export const mockFirstCompliancePeriodDetails: FirstCompliancePeriodDetails = {
  organisationalEnergyConsumption: 0,
  organisationalEnergyConsumptionBreakdown: mockEnergyConsumptionBreakdown,
  significantEnergyConsumption: mockSignificantEnergyConsumption,
  explanation: 'Explanation for changes in total consumption',
  potentialReduction: mockEnergyConsumptionBreakdown,
};

export const mockFirstCompliancePeriod: FirstCompliancePeriod = {
  informationExists: 'YES',
  firstCompliancePeriodDetails: mockFirstCompliancePeriodDetails,
};

export const mockSecondCompliancePeriod: SecondCompliancePeriod = {
  informationExists: 'YES',
  reductionAchieved: mockEnergyConsumptionBreakdown,
  firstCompliancePeriodDetails: mockFirstCompliancePeriodDetails,
};

export const mockConfirmations: Confirmations = {
  responsibilityAssessmentTypes: [
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],
  noEnergyResponsibilityAssessmentTypes: [
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],

  responsibleOfficerDetails: {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
  reviewAssessmentDate: '2022-02-02',
  secondResponsibleOfficerEnergyTypes: [
    'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
    'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
    'SATISFIED_WITH_INFORMATION_PROVIDED',
  ],

  secondResponsibleOfficerDetails: {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Job title',
    email: null,
    phoneNumber: { countryCode: '44', number: '1234567890' },
    mobileNumber: { countryCode: undefined, number: undefined },
    line1: 'Line',
    line2: null,
    city: 'City',
    county: 'County',
    postcode: 'Postcode',
  },
};

export const mockAlternativeComplianceRoutes: AlternativeComplianceRoutes = {
  totalEnergyConsumptionReduction: { energyConsumption: 12, energyCost: '0.00' },
  energyConsumptionReduction: {
    buildings: { energyConsumption: 1, energyCost: '0.00' },
    transport: { energyConsumption: 2, energyCost: '0.00' },
    industrialProcesses: { energyConsumption: 4, energyCost: '0.00' },
    otherProcesses: { energyConsumption: 2, energyCost: '0.00' },
    energyConsumptionTotal: 9,
    energyCostTotal: '0.00',
  },
  energyConsumptionReductionCategories: {
    energyManagementPractices: { energyConsumption: 1, energyCost: '0.00' },
    behaviourChangeInterventions: { energyConsumption: 1, energyCost: '0.00' },
    training: { energyConsumption: 3, energyCost: '0.00' },
    controlsImprovements: { energyConsumption: 2, energyCost: '0.00' },
    capitalInvestments: { energyConsumption: 1, energyCost: '0.00' },
    otherMeasures: { energyConsumption: 1, energyCost: '0.00' },
    energyConsumptionTotal: 9,
    energyCostTotal: '0.00',
  },
  assets: {
    iso50001: 'iso1',
    dec: 'dec1',
    gda: 'gda1',
  },
  iso50001CertificateDetails: {
    certificateNumber: 'iso1',
    validFrom: '2022-01-01T00:00:00.000Z',
    validUntil: '2024-01-01T00:00:00.000Z',
  },
  decCertificatesDetails: {
    certificateDetails: [
      {
        certificateNumber: 'dec1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      {
        certificateNumber: 'dec2',
        validFrom: '2020-01-01T00:00:00.000Z',
        validUntil: '2023-12-15T00:00:00.000Z',
      },
    ],
  },
  gdaCertificatesDetails: {
    certificateDetails: [
      {
        certificateNumber: 'gda1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      {
        certificateNumber: 'gda2',
        validFrom: '2020-01-01T00:00:00.000Z',
        validUntil: '2023-12-05T00:02:00.000Z',
      },
    ],
  },
};

export const mockNotificationRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        noc: {
          contactPersons: {} as ContactPersons,
          assessmentPersonnel: {} as AssessmentPersonnel,
          reportingObligation: { qualificationType: 'QUALIFY' },
          organisationStructure: {} as OrganisationStructure,
          confirmations: {} as Confirmations,
        },
        accountOriginatedData: {
          primaryContact: mockContactPersons.primaryContact,
          secondaryContact: {
            firstName: 'Paul',
            lastName: 'Doe',
            jobTitle: 'Job title second',
            email: null,
            line1: 'Line second',
            city: 'City second',
            county: 'County second',
            postcode: 'Postcode second',
          },
          organisationDetails: {
            name: 'Ru Org Name',
            registrationNumber: '11112222',
            type: 'SIC',
            codes: ['2222'],
            city: 'City',
            county: 'Powys',
            line1: 'Line 1',
            line2: 'Line 2',
            postcode: 'Postcode',
          },
        },
        nocSectionsCompleted: {
          contactPersons: 'IN_PROGRESS',
          assessmentPersonnel: 'IN_PROGRESS',
          energySavingsAchieved: 'IN_PROGRESS',
          confirmations: 'IN_PROGRESS',
        },
      } as unknown as NotificationTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof NotificationTaskPayload['noc'], any>>,
  taskStatus?: Partial<Record<keyof NotificationTaskPayload['noc'], TaskItemStatus>>,
): RequestTaskState => {
  return {
    ...mockNotificationRequestTask,
    requestTaskItem: produce(mockNotificationRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as NotificationTaskPayload;

      payload.noc = { ...payload.noc, ...data };
      payload.nocSectionsCompleted = { ...payload.nocSectionsCompleted, ...taskStatus };
    }),
  };
};

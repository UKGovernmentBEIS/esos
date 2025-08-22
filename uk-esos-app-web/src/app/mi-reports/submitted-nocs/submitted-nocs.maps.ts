import {
  AlternativeComplianceRoutesTab,
  CommonDataTab,
  ComplianceRouteTab,
  ConfirmationsTab,
  EnergyConsumptionDetailsTab,
  EnergySavingsAchievedTab,
  EnergySavingsOpportunitiesTab,
  LeadAssessorTab,
  OrganisationStructureTab,
  ReportingObligationTab,
  ResponsibleUndertakingTab,
  TableOfContentTab,
} from './submitted-nocs.interfaces';

export const commonDataHeaderMap: CommonDataTab = {
  nocId: 'NOC ID',
  regOrganisationName: 'Organisation name',
  regNumber: 'Company registration number',
  accountStatus: 'Account status',
};

export const tableOfContentHeaderMap: TableOfContentTab = {
  sheet: 'Sheet',
  description: 'Description',
};

export const reportingObligationHeaderMap: ReportingObligationTab = {
  qualificationType: 'Does your organisation qualify for ESOS?',
  noQualificationReason: 'Explain why your organisation does not qualify for ESOS',
  qualificationReasonType: 'Select the reasons that your organisation qualifies for ESOS',
  energyResponsibilityType: 'Are the organisations within this notification, responsible for any energy under ESOS?',
  totalPct:
    'Enter a breakdown of the total energy consumption covered by each compliance route in this notification - Total',
  iso50001Pct: 'Enter the breakdown of the total energy consumption by compliance route used - ISO 50001',
  displayEnergyCertificatePct:
    'Enter the breakdown of the total energy consumption by compliance route used - Display Energy Certificate',
  greenDealAssessmentPct:
    'Enter the breakdown of the total energy consumption by compliance route used - Green Deal Assessment',
  energyAuditsPct:
    'Enter the breakdown of the total energy consumption by compliance route used - Energy audits that are compliant with ESOS',
  energyNotAuditedPct:
    'Enter the breakdown of the total energy consumption by compliance route used - Energy use not covered by any compliance route',
};

export const responsibleUndetakingHeaderMap: ResponsibleUndertakingTab = {
  registrationNumberExist: 'Is the UK organisation registered at Companies House?',
  type: 'Activity Codes - Classification Type',
  code1: 'Activity Codes - Code 1',
  code2: 'Activity Codes - Code 2 (Optional)',
  code3: 'Activity Codes - Code 3 (Optional)',
  code4: 'Activity Codes - Code 4 (Optional)',
  line1: 'Organisation address - Address line 1',
  line2: 'Organisation address - Address line 2 (optional)',
  city: 'Organisation address - Town or City',
  county: 'Organisation address - County (optional)',
  postcode: 'Organisation address - Postcode',
  location: 'Organisation address - Location of Registered Office',
  tradingExists: 'Does the organisation operate under a trading name that is different to the registered name?',
  tradingName:
    'If the organisation operate under a trading name that is different to the registered name, enter the trading or other name',
  trustNameExist: 'Does this ESOS notification include information in relation to energy consumption of a trust asset?',
  trustName:
    'If the ESOS notification include information in relation to energy consumption of a trust asset, enter a description or name of relevant trust assets? (optional)',
  hasOverseasParentDetails: 'Does your organisation have a parent company to which the ESOS regulations do not extend?',
  overseasParentName: 'Enter the name of the overseas parent company',
  overseasParentTradingName:
    'Enter the trading or other name of the group of undertakings to which the above company is the overseas parent (optional)',
};

export const organisationStructureHeaderMap: OrganisationStructureTab = {
  isOrganisationRU: 'Is this organisation the Responsible Undertaking?',
  isHighestParent:
    'Is the Responsible Undertaking a highest parent which has agreed to aggregate with one or more other highest parents to comply as one participant?',
  isNonComplyingUndertakingsIncluded:
    'Did the Responsible Undertaking’s group include any undertakings on 31 December 2022 which either disaggregated from, or ceased to be part of the participant before 5 June 2024 and which are not complying as if they were still a member of the participant?',
  disaggregatedOrganisationName:
    'Names of undertakings which disaggregated from or ceased to be part of the participant and which are not included in the NOC',
  disaggregatedRegistrationNumber:
    'Company registration numbers of undertakings which disaggregated from or ceased to be part of the participant and which are not included in the NOC',
  isOrganisationCoveredBytheNoc: 'Is the organisation covered by the NOC?',
  organisationName: 'Names of relevant undertakings included in the NOC',
  registrationNumber: 'Company registration numbers of relevant undertakings included in the NOC',
  isPartOfArrangement:
    'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?',
  hasCeasedToBePartOfGroup:
    'Has this organisation ceased to be part of the highest parent group or participant since the qualification date but agreed to comply as if it were still a member?',
  isPartOfFranchise: 'Is this organisation a franchisee?',
  isParentOfResponsibleUndertaking: 'Is this organisation a parent of the responsible undertaking?',
  isSubsidiaryOfResponsibleUndertaking: 'Is this organisation a subsidiary of the responsible undertaking?',
  areSameAsRU: 'Is the Code same as RU?',
  codeType: 'Select classification type if the organisation covered in this NOC',
  otherTypeName: 'Classification name (if other than SIC)',
  code1: 'Code 1',
  code2: 'Code 2 (Optional)',
  code3: 'Code 3 (Optional)',
  code4: 'Code 4 (Optional)',
};

export const complianceRouteHeaderMap: ComplianceRouteTab = {
  estimatedCalculationTypes: 'Did you use any estimates in relation to the following calculations (as applicable)?',
  calculationType1:
    'Estimates were used for calculating the total energy consumption, or significant energy consumption, over the reference period.',
  calculationType2:
    'Estimates were used for the conversion of total energy consumption, or significant energy consumption, into kWh, where it was not measured in those units.',
  calculationType3:
    'Estimates were used for calculating the amount of total energy consumption, or significant energy consumption, attributable to each organisational purpose in kWh.',
  calculationType4:
    'Estimates were used for the calculation of energy consumption  over the 12-month period covered by any energy audit.',
  calculationType5:
    'The calculations of energy consumption did not use any estimates requiring notification under the ESOS regulations',
  areTwelveMonthsVerifiableDataUsed: 'Did all your energy audits use 12 months of verifiable data?',
  areEstimationMethodsRecorded: 'Are the methods used for estimated data recorded in the evidence pack?',
  energyConsumptionProfilingUsed:
    'Did this organisation use energy consumption profiling for the purpose of analysing its energy consumption for all ESOS energy audits?',
  areEnergyConsumptionProfilingMethodsRecorded:
    'Are the methods used for energy consumption profiling recorded in the evidence pack? (optional)',
  isEnergyConsumptionProfilingNotUsedRecorded:
    'Does the evidence pack record the extent to which, and the reasons why, energy consumption profiling was not used in the energy audit and the details of the alternative method of analysis used?',
  energyAuditDescription: 'Add an energy audit (optional) - Explain where the audit took place and what was covered',
  energyAuditNumberOfSitesCovered: 'Add an energy audit (optional) - Number of sites covered by the audit (optional)',
  energyAuditNumberOfSitesVisited: 'Add an energy audit (optional) - Number of sites visited',
  energyAuditReason:
    'Add an energy audit (optional) - Reason why the sites visited for the energy audit are considered to be representative of how energy is used by the assets and activities during the period covered by the audit',
};

export const energyConsumptionDetailsHeaderMap: EnergyConsumptionDetailsTab = {
  totalEnergyConsumption: 'What is the total energy consumption in kWh for the reference period?',
  significantEnergyConsumptionExists: 'Have you identified areas of significant energy consumption?',
  significantEnergyConsumptionTotal: 'What is the significant energy consumption in kWh?',
  buildingsIntensityRatio: 'Buildings - Energy Intensity Ratio kWh',
  buildingsIntensityUnit: 'Buildings - Indicator of activity',
  buildingsIntensityInfo: 'Buildings - Additional context about the intensity ratio calculations (optional)',
  transportIntensityRatio: 'Transport - Energy Intensity Ratio kWh',
  transportIntensityUnit: 'Transport - Indicator of activity',
  transportIntensityInfo: 'Transport - Additional context about the intensity ratio calculations (optional)',
  industrialIntensityRatio: 'Industrial Processes - Energy Intensity Ratio kWh',
  industrialIntensityUnit: 'Industrial Processes - Indicator of activity',
  industrialIntensityInfo:
    'Industrial processes - Additional context about the intensity ratio calculations (optional)',
  otherIntensityRatio: 'Other processes - Energy Intensity Ratio kWh',
  otherIntensityUnit: 'Other processes - Indicator of activity',
  otherIntensityInfo: 'Other processes - Additional context about the intensity ratio calculations (optional)',
  additionalInformationExists: 'Do you want to add more information to give context to the energy intensity ratio?',
  additionalInformation: 'If yes, enter the additional information',
};

export const energySavingsOpportunitiesHeaderMap: EnergySavingsOpportunitiesTab = {
  implementationEnergyConsumptionTotalKwh:
    'Total annual reduction in energy consumption and energy spend from implementing energy saving opportunities - kWh',
  implementationEnergyConsumptionTotalCost:
    'Total annual reduction in energy consumption and energy spend from implementing energy saving opportunities - £',
  energyConsumptionTotalKwh:
    'Annual reduction in energy consumption and energy spend by organisational purpose - Total kWh',
  energyConsumptionTotalCost:
    'Annual reduction in energy consumption and energy spend by organisational purpose - Total £',
  energySavingsCategoriesTotalKwh:
    'Annual reduction in energy consumption and energy spend by energy saving category - Total kWh',
  energySavingsCategoriesTotalCost:
    'Annual reduction in energy consumption and energy spend by energy saving category - Total £',
};

export const alternativeComplianceRoutesHeaderMap: AlternativeComplianceRoutesTab = {
  totalEnergyConsumptionReductionTotalKwh:
    'Total annual reduction in energy consumption and energy spend from implementing energy saving measures - kWh',
  totalEnergyConsumptionReductionTotalCost:
    'Total annual reduction in energy consumption and energy spend from implementing energy saving measures - £',
  energyConsumptionReductionTotalKwh:
    'Annual reduction in energy consumption and energy spend by organisational purpose - Total kWh',
  energyConsumptionReductionTotalCost:
    'Annual reduction in energy consumption and energy spend by organisational purpose -Total  £',
  energyConsumptionReductionCategoriesTotalKwh:
    'Annual reduction in energy consumption and energy spend by energy saving category - Total kWh',
  energyConsumptionReductionCategoriesTotalCost:
    'Annual reduction in energy consumption and energy spend by energy saving category -Total £',
  assetsIso50001: 'List your assets and activities that fall under each alternative compliance route - ISO 50001',
  assetsDec:
    'List your assets and activities that fall under each alternative compliance route - Display Energy Certificate (DECs)',
  assetsGda:
    'List your assets and activities that fall under each alternative compliance route - Green Deal Assessment',

  iso50001CertificateDetailsCertificateNumber: 'Provide ISO 50001 Certificate number (Optional)',
  decCertificatesDetailsCertificateNumber: 'Provide Display Energy Certificate (DEC) number (Optional)',
  gdaCertificatesDetailsCertificateNumber: 'Provide Green Deal Assessment Report reference number (Optional)',
  validFrom: 'Valid from',
  validUntil: 'Valid until',
};

export const energySavingsAchievedHeaderMap: EnergySavingsAchievedTab = {
  totalEnergySavingsEstimation:
    'What is the estimate of the total energy savings achieved during the third compliance period?',
  energySavingsEstimationTotalKwh:
    'Estimate of the energy savings achieved during the third compliance period by organisational purpose? Total kWh',
  energySavingCategoriesExist:
    'Do you have any information on the energy savings achieved during the compliance period against different energy saving categories?',
  energySavingsCategoriesTotalKwh:
    'Estimate of the energy savings achieved during the third compliance period by energy saving category? Total kWh',
  energySavingsRecommendationsExist:
    'Do you have any data on the proportion of energy savings achieved which relate to recommendations from different sources?',
};

export const leadAssessorHeaderMap: LeadAssessorTab = {
  leadAssessorType:
    'Is the lead assessor who reviewed your ESOS assessment internal or external to your corporate group?',
  hasLeadAssessorConfirmation:
    'Has the lead assessor reviewed and confirmed that the assessment meets the ESOS requirements?',
};

export const confirmationsHeaderMap: ConfirmationsTab = {
  hasResponsibleOfficerReview:
    'The responsible officer has provided confirmations required in relation to compliance with ESOS by the organisation, which has energy responsibility.',
  hasNoResponsibleOfficerReview:
    'The responsible officer has provided confirmations required in relation to compliance with ESOS by the organisation, which has no energy responsibility.',
  reviewAssessmentDate: 'When did the responsible officer review the ESOS assessment recommendations?',
  hasSecondResponsibleOfficerReview: 'Second Responsible officer review',
};

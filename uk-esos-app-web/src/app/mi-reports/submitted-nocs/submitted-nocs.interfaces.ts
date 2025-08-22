import { NocP3SearchResultsInfoDto } from 'esos-api';

export interface NocReportResult {
  total: number;
  nocs: Array<NocP3SearchResultsInfoDto>;
}

export interface CommonDataTab {
  nocId: string;
  regOrganisationName: string;
  regNumber: string;
  accountStatus: string;
}

export interface TableOfContentTab {
  sheet: string;
  description: string;
}

export interface ReportingObligationTab {
  qualificationType: string;
  noQualificationReason: string;
  qualificationReasonType: string;
  energyResponsibilityType: string;
  totalPct: string;
  iso50001Pct: string;
  displayEnergyCertificatePct: string;
  greenDealAssessmentPct: string;
  energyAuditsPct: string;
  energyNotAuditedPct: string;
}

export interface ResponsibleUndertakingTab {
  registrationNumberExist: string;
  type: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  location: string;
  tradingExists: string;
  tradingName: string;
  trustNameExist: string;
  trustName: string;
  hasOverseasParentDetails: string;
  overseasParentName: string;
  overseasParentTradingName: string;
}

export interface OrganisationStructureTab {
  isOrganisationRU: string;
  isHighestParent: string;
  isNonComplyingUndertakingsIncluded: string;
  disaggregatedOrganisationName: string;
  disaggregatedRegistrationNumber: string;
  isOrganisationCoveredBytheNoc: string;
  organisationName: string;
  registrationNumber: string;
  isPartOfArrangement: string;
  hasCeasedToBePartOfGroup: string;
  isPartOfFranchise: string;
  isParentOfResponsibleUndertaking: string;
  isSubsidiaryOfResponsibleUndertaking: string;
  areSameAsRU: string;
  codeType: string;
  otherTypeName: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
}

export interface ComplianceRouteTab {
  estimatedCalculationTypes: string;
  calculationType1: string;
  calculationType2: string;
  calculationType3: string;
  calculationType4: string;
  calculationType5: string;
  areTwelveMonthsVerifiableDataUsed: string;
  areEstimationMethodsRecorded: string;
  energyConsumptionProfilingUsed: string;
  areEnergyConsumptionProfilingMethodsRecorded: string;
  isEnergyConsumptionProfilingNotUsedRecorded: string;
  energyAuditDescription: string;
  energyAuditNumberOfSitesCovered: string;
  energyAuditNumberOfSitesVisited: string;
  energyAuditReason: string;
}

export interface EnergyConsumptionDetailsTab {
  totalEnergyConsumption: string;
  significantEnergyConsumptionExists: string;
  significantEnergyConsumptionTotal: string;
  significantEnergyConsumptionTotalPct?: string;
  buildingsIntensityRatio: string;
  buildingsIntensityUnit: string;
  buildingsIntensityInfo: string;
  transportIntensityRatio: string;
  transportIntensityUnit: string;
  transportIntensityInfo: string;
  industrialIntensityRatio: string;
  industrialIntensityUnit: string;
  industrialIntensityInfo: string;
  otherIntensityRatio: string;
  otherIntensityUnit: string;
  otherIntensityInfo: string;
  additionalInformationExists: string;
  additionalInformation: string;
}

export interface EnergySavingsOpportunitiesTab {
  implementationEnergyConsumptionTotalKwh: string;
  implementationEnergyConsumptionTotalCost: string;
  energyConsumptionTotalKwh: string;
  energyConsumptionTotalCost: string;
  energySavingsCategoriesTotalKwh: string;
  energySavingsCategoriesTotalCost: string;
}

export interface AlternativeComplianceRoutesTab {
  totalEnergyConsumptionReductionTotalKwh: string;
  totalEnergyConsumptionReductionTotalCost: string;
  energyConsumptionReductionTotalKwh: string;
  energyConsumptionReductionTotalCost: string;
  energyConsumptionReductionCategoriesTotalKwh: string;
  energyConsumptionReductionCategoriesTotalCost: string;
  assetsIso50001: string;
  assetsDec: string;
  assetsGda: string;
  iso50001CertificateDetailsCertificateNumber: string;
  decCertificatesDetailsCertificateNumber: string;
  gdaCertificatesDetailsCertificateNumber: string;
  validFrom: string;
  validUntil: string;
}

export interface EnergySavingsAchievedTab {
  totalEnergySavingsEstimation?: string;
  energySavingsEstimationTotalKwh?: string;
  energySavingCategoriesExist: string;
  energySavingsCategoriesTotalKwh: string;
  energySavingsRecommendationsExist: string;
}

export interface LeadAssessorTab {
  leadAssessorType: string;
  hasLeadAssessorConfirmation: string;
}

export interface ConfirmationsTab {
  hasResponsibleOfficerReview: string;
  hasNoResponsibleOfficerReview: string;
  reviewAssessmentDate: string;
  hasSecondResponsibleOfficerReview: string;
}

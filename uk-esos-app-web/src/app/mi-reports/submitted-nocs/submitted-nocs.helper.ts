import { reportingObligationContentMap } from '@shared/components/summaries';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { ClassificationTypePipe } from '@shared/pipes/classification-type.pipe';
import { CompetentAuthorityLocationPipe } from '@shared/pipes/competent-authority-location.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { InternalExternalPipe } from '@shared/pipes/internal-external.pipe';
import { NotApplicablePipe } from '@shared/pipes/not-applicable.pipe';
import { SkipQuestionPipe } from '@shared/pipes/skip-question.pipe';
import { utils, WorkBook, writeFileXLSX } from 'xlsx';

import { ComplianceRoute, NocP3SearchResultsInfoDto, OrganisationStructure } from 'esos-api';

import { NocReportResult } from './submitted-nocs.interfaces';
import {
  alternativeComplianceRoutesHeaderMap,
  commonDataHeaderMap,
  complianceRouteHeaderMap,
  confirmationsHeaderMap,
  energyConsumptionDetailsHeaderMap,
  energySavingsAchievedHeaderMap,
  energySavingsOpportunitiesHeaderMap,
  leadAssessorHeaderMap,
  organisationStructureHeaderMap,
  reportingObligationHeaderMap,
  responsibleUndetakingHeaderMap,
  tableOfContentHeaderMap,
} from './submitted-nocs.maps';

const booleanToTextPipe = new BooleanToTextPipe();
const classificationTypePipe = new ClassificationTypePipe();
const skipQuestionPipe = new SkipQuestionPipe();
const notApplicablePipe = new NotApplicablePipe();
const internalExternalPipe = new InternalExternalPipe();
const govukDatePipe = new GovukDatePipe();
const competentAuthorityLocationPipe = new CompetentAuthorityLocationPipe();
const emptyData = '-';

export const manipulateNocsAndExportToExcel = (res: NocReportResult) => {
  const wb = utils.book_new();

  createSheet(wb, createTableOfContentsTabData(), 'Table of contents');
  createSheet(wb, createReportingObligationTabData(res.nocs), 'Reporting Obligation');
  createSheet(wb, createResponsibleUndertakingTabData(res.nocs), 'Responsible Undertaking');
  createSheet(wb, createOrganisationStructureTabData(res.nocs), 'Organisation Structure');
  createSheet(wb, createComplianceRouteTabData(res.nocs), 'Compliance Route');
  createSheet(wb, createEnergyConsumptionTabData(res.nocs), 'Energy Consumption');
  createSheet(wb, createEnergySavingsOpportunitiesTabData(res.nocs), 'Energy Savings Opportunities');
  createSheet(wb, createAlternativeRouteComplianceTabData(res.nocs), 'Alternative Routes Compliance');
  createSheet(wb, createEnergySavingsAchievedTabData(res.nocs), 'Energy Savings Achieved');
  createSheet(wb, createLeadAssessorTabData(res.nocs), 'Lead Assessor');
  createSheet(wb, createResponsibleConfirmationTabData(res.nocs), 'Responsible Confirmations');

  writeFileXLSX(wb, 'Energy_Savings_Opportunity_Scheme_Phase_3.xlsx');
};

const createSheet = (
  wb: WorkBook,
  data: Array<{
    [x: string]: string;
  }>,
  name: string,
) => {
  utils.book_append_sheet(wb, utils.json_to_sheet(data), name);
};

const getNocBasicData = (nocData: NocP3SearchResultsInfoDto) => {
  const { nocId, regOrganisationName, regNumber, accountStatus } = commonDataHeaderMap;
  const name = nocData.noc?.responsibleUndertaking?.organisationDetails?.name ?? nocData.organisationName;
  const registrationNumber =
    nocData.noc?.responsibleUndertaking?.organisationDetails?.registrationNumber ?? nocData.registrationNumber;
  const accountStatusPipe = new AccountStatusPipe();

  return {
    [nocId]: nocData.id,
    [regOrganisationName]: name,
    [regNumber]: registrationNumber || emptyData,
    [accountStatus]: accountStatusPipe.transform(nocData.status),
  };
};

const createTableOfContentsTabData = () => {
  const { sheet, description } = tableOfContentHeaderMap;

  return [
    {
      [sheet]: 'Reporting obligation',
      [description]: 'Gives details about whether the organisation is required to participate in ESOS',
    },
    {
      [sheet]: 'Responsible undertaking',
      [description]: 'Gives details about the Responsible Undertaking',
    },
    {
      [sheet]: 'Organisation structure',
      [description]: 'Gives details about the group structure of the organisation',
    },
    {
      [sheet]: 'Compliance route',
      [description]: 'Gives details about the estimates and other information about the assessment',
    },
    {
      [sheet]: 'Energy consumption',
      [description]:
        'Gives details about high level energy consumption data (including energy intensity ratios) calculated as part of the ESOS assessment',
    },
    {
      [sheet]: 'Energy savings opportunities',
      [description]:
        'Gives details about information relating to energy saving measures identified through the ESOS assessment through energy audits',
    },
    {
      [sheet]: 'Alternative routes to compliance',
      [description]:
        'Gives details about information relating to energy saving measures identified through the ESOS assessment through alternative compliance routes',
    },
    {
      [sheet]: 'Energy savings achieved',
      [description]:
        'Gives details about information relating to energy savings achieved since the previous compliance date',
    },
    {
      [sheet]: 'Lead assessor details',
      [description]: 'Gives details about confirmation of the lead assessor, if one is required',
    },
    {
      [sheet]: 'Confirmations',
      [description]:
        'Gives details about the responsible officers who sign off on both the ESOS assessment and the content of the compliance notification',
    },
  ];
};

const filteredNocs = (results: NocReportResult['nocs']) => {
  return results.filter((nocs) => nocs.noc.reportingObligation.qualificationType !== 'NOT_QUALIFY');
};

const createReportingObligationTabData = (results: NocReportResult['nocs']) => {
  const mapper = reportingObligationHeaderMap;

  const reportingObligationData = results.map((res) => {
    const { qualificationType, noQualificationReason, reportingObligationDetails } = res.noc.reportingObligation;

    return {
      ...getNocBasicData(res),
      [mapper.qualificationType]: qualificationType === 'QUALIFY' ? 'Yes' : 'No',
      [mapper.noQualificationReason]: noQualificationReason || emptyData,
      [mapper.qualificationReasonType]:
        reportingObligationContentMap.qualificationReason[reportingObligationDetails?.qualificationReasonType] ||
        emptyData,
      [mapper.energyResponsibilityType]:
        reportingObligationContentMap.energyResponsibility[reportingObligationDetails?.energyResponsibilityType] ||
        emptyData,
      [mapper.totalPct]: reportingObligationDetails?.complianceRouteDistribution?.totalPct
        ? `${reportingObligationDetails?.complianceRouteDistribution.totalPct}%`
        : emptyData,
      [mapper.iso50001Pct]: reportingObligationDetails?.complianceRouteDistribution?.iso50001Pct
        ? `${reportingObligationDetails?.complianceRouteDistribution.iso50001Pct}%`
        : emptyData,
      [mapper.displayEnergyCertificatePct]: reportingObligationDetails?.complianceRouteDistribution
        ?.displayEnergyCertificatePct
        ? `${reportingObligationDetails?.complianceRouteDistribution.displayEnergyCertificatePct}%`
        : emptyData,
      [mapper.greenDealAssessmentPct]: reportingObligationDetails?.complianceRouteDistribution?.greenDealAssessmentPct
        ? `${reportingObligationDetails?.complianceRouteDistribution.greenDealAssessmentPct}%`
        : emptyData,
      [mapper.energyAuditsPct]: reportingObligationDetails?.complianceRouteDistribution?.energyAuditsPct
        ? `${reportingObligationDetails?.complianceRouteDistribution.energyAuditsPct}%`
        : emptyData,
      [mapper.energyNotAuditedPct]: reportingObligationDetails?.complianceRouteDistribution?.energyNotAuditedPct
        ? `${reportingObligationDetails?.complianceRouteDistribution.energyNotAuditedPct}%`
        : emptyData,
    };
  });

  return reportingObligationData;
};

const createResponsibleUndertakingTabData = (results: NocReportResult['nocs']) => {
  const mapper = responsibleUndetakingHeaderMap;

  const responsibleUndertakingData = filteredNocs(results).map((res) => {
    const {
      organisationDetails,
      tradingDetails: { exist, tradingName },
      trustName,
      hasOverseasParentDetails,
      overseasParentDetails,
    } = res.noc.responsibleUndertaking || {};

    return {
      ...getNocBasicData(res),
      [mapper.registrationNumberExist]: booleanToTextPipe.transform(organisationDetails.registrationNumberExist),
      [mapper.type]: classificationTypePipe.transform(organisationDetails.type),
      [mapper.code1]: organisationDetails.codes[0],
      [mapper.code2]: organisationDetails.codes.length > 1 ? organisationDetails.codes[1] : emptyData,
      [mapper.code3]: organisationDetails.codes.length > 2 ? organisationDetails.codes[2] : emptyData,
      [mapper.code4]: organisationDetails.codes.length > 3 ? organisationDetails.codes[3] : emptyData,
      [mapper.line1]: organisationDetails.line1,
      [mapper.line2]: organisationDetails.line2 || emptyData,
      [mapper.city]: organisationDetails.city,
      [mapper.county]: organisationDetails.county || emptyData,
      [mapper.postcode]: organisationDetails.postcode,
      [mapper.location]: competentAuthorityLocationPipe.transform(res.location),
      [mapper.tradingExists]: booleanToTextPipe.transform(exist),
      [mapper.tradingName]: tradingName || emptyData,
      [mapper.trustNameExist]: booleanToTextPipe.transform(!!trustName),
      [mapper.trustName]: trustName || emptyData,
      [mapper.hasOverseasParentDetails]: booleanToTextPipe.transform(hasOverseasParentDetails),
      [mapper.overseasParentName]: overseasParentDetails?.name || emptyData,
      [mapper.overseasParentTradingName]: overseasParentDetails?.tradingName || emptyData,
    };
  });

  return responsibleUndertakingData;
};

const createOrganisationStructureTabData = (results: NocReportResult['nocs']) => {
  const mapper = organisationStructureHeaderMap;
  const basicMapper = commonDataHeaderMap;
  const organisationStructureData: Array<{ [x: string]: string }> = [];

  filteredNocs(results).forEach((res) => {
    const nocBasicData = getNocBasicData(res);

    const { ...organisationStructure } = res.noc.organisationStructure || ({} as OrganisationStructure);

    // Add organisation in RU
    organisationStructureData.push({
      ...nocBasicData,
      [mapper.isOrganisationRU]: booleanToTextPipe.transform(true),
      [mapper.isHighestParent]: booleanToTextPipe.transform(organisationStructure.isHighestParent),
      [mapper.isNonComplyingUndertakingsIncluded]: booleanToTextPipe.transform(
        organisationStructure.isNonComplyingUndertakingsIncluded,
      ),
      [mapper.disaggregatedOrganisationName]: emptyData,
      [mapper.disaggregatedRegistrationNumber]: emptyData,
      [mapper.isOrganisationCoveredBytheNoc]: booleanToTextPipe.transform(true),
      [mapper.organisationName]: nocBasicData[basicMapper.regOrganisationName],
      [mapper.registrationNumber]: nocBasicData[basicMapper.regNumber],
      [mapper.isPartOfArrangement]: emptyData,
      [mapper.hasCeasedToBePartOfGroup]: emptyData,
      [mapper.isPartOfFranchise]: emptyData,
      [mapper.isParentOfResponsibleUndertaking]: emptyData,
      [mapper.isSubsidiaryOfResponsibleUndertaking]: emptyData,
      [mapper.areSameAsRU]: emptyData,
      [mapper.codeType]: emptyData,
      [mapper.otherTypeName]: emptyData,
      [mapper.code1]: emptyData,
      [mapper.code2]: emptyData,
      [mapper.code3]: emptyData,
      [mapper.code4]: emptyData,
    });

    (organisationStructure?.organisationsAssociatedWithRU ?? []).forEach((el) => {
      const classificationCodesDetails = el.classificationCodesDetails;

      organisationStructureData.push({
        ...nocBasicData,
        [mapper.isOrganisationRU]: booleanToTextPipe.transform(false),
        [mapper.isHighestParent]: emptyData,
        [mapper.isNonComplyingUndertakingsIncluded]: emptyData,
        [mapper.disaggregatedOrganisationName]: emptyData,
        [mapper.disaggregatedRegistrationNumber]: emptyData,
        [mapper.isOrganisationCoveredBytheNoc]: booleanToTextPipe.transform(true),
        [mapper.organisationName]: el.organisationName || emptyData,
        [mapper.registrationNumber]: el.registrationNumber || emptyData,
        [mapper.isPartOfArrangement]: booleanToTextPipe.transform(el.isPartOfArrangement) || emptyData,
        [mapper.hasCeasedToBePartOfGroup]: booleanToTextPipe.transform(el.hasCeasedToBePartOfGroup) || emptyData,
        [mapper.isPartOfFranchise]: booleanToTextPipe.transform(el.isPartOfFranchise) || emptyData,
        [mapper.isParentOfResponsibleUndertaking]:
          booleanToTextPipe.transform(el.isParentOfResponsibleUndertaking) || emptyData,
        [mapper.isSubsidiaryOfResponsibleUndertaking]:
          booleanToTextPipe.transform(el.isSubsidiaryOfResponsibleUndertaking) || emptyData,
        [mapper.areSameAsRU]: booleanToTextPipe.transform(classificationCodesDetails.areSameAsRU) || emptyData,
        [mapper.codeType]: classificationCodesDetails.codes?.type || emptyData,
        [mapper.otherTypeName]: classificationCodesDetails.codes?.otherTypeName || emptyData,
        [mapper.code1]:
          classificationCodesDetails.codes?.codes?.length > 0 ? classificationCodesDetails.codes?.codes[0] : emptyData,
        [mapper.code2]:
          classificationCodesDetails.codes?.codes?.length > 1 ? classificationCodesDetails.codes?.codes[1] : emptyData,
        [mapper.code3]:
          classificationCodesDetails.codes?.codes?.length > 2 ? classificationCodesDetails.codes?.codes[2] : emptyData,
        [mapper.code4]:
          classificationCodesDetails.codes?.codes?.length > 3 ? classificationCodesDetails.codes?.codes[3] : emptyData,
      });
    });

    // Disaggregated undertakings
    (organisationStructure?.organisationUndertakingDetails ?? []).forEach((el) => {
      organisationStructureData.push({
        ...nocBasicData,
        [mapper.isOrganisationRU]: booleanToTextPipe.transform(false),
        [mapper.isHighestParent]: emptyData,
        [mapper.isNonComplyingUndertakingsIncluded]: emptyData,
        [mapper.disaggregatedOrganisationName]: el.organisationName || emptyData,
        [mapper.disaggregatedRegistrationNumber]: el.registrationNumber || emptyData,
        [mapper.isOrganisationCoveredBytheNoc]: booleanToTextPipe.transform(false),
        [mapper.organisationName]: emptyData,
        [mapper.registrationNumber]: emptyData,
        [mapper.isPartOfArrangement]: emptyData,
        [mapper.hasCeasedToBePartOfGroup]: emptyData,
        [mapper.isPartOfFranchise]: emptyData,
        [mapper.isParentOfResponsibleUndertaking]: emptyData,
        [mapper.isSubsidiaryOfResponsibleUndertaking]: emptyData,
        [mapper.areSameAsRU]: emptyData,
        [mapper.codeType]: emptyData,
        [mapper.otherTypeName]: emptyData,
        [mapper.code1]: emptyData,
        [mapper.code2]: emptyData,
        [mapper.code3]: emptyData,
        [mapper.code4]: emptyData,
      });
    });
  });

  return organisationStructureData;
};

const createComplianceRouteTabData = (results: NocReportResult['nocs']) => {
  const mapper = complianceRouteHeaderMap;
  const complianceRouteData: Array<{ [x: string]: string }> = [];

  filteredNocs(results).forEach((res) => {
    const { ...complianceRoute } = res.noc.complianceRoute || ({} as ComplianceRoute);
    const energyAudits = res.noc?.complianceRoute?.energyAudits ?? [];

    if (energyAudits.length === 0) {
      energyAudits.push({
        description: emptyData,
        numberOfSitesVisited: undefined,
        reason: emptyData,
      });
    }

    energyAudits.forEach((audit) => {
      complianceRouteData.push({
        ...getNocBasicData(res),
        [mapper.estimatedCalculationTypes]:
          booleanToTextPipe.transform(!complianceRoute.estimatedCalculationTypes?.includes('NONE_OF_THE_ABOVE')) ||
          emptyData,
        [mapper.calculationType1]:
          booleanToTextPipe.transform(
            !complianceRoute.estimatedCalculationTypes?.includes('TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION'),
          ) || emptyData,
        [mapper.calculationType2]:
          booleanToTextPipe.transform(
            !complianceRoute.estimatedCalculationTypes?.includes(
              'CONVERSION_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION',
            ),
          ) || emptyData,
        [mapper.calculationType3]:
          booleanToTextPipe.transform(
            !complianceRoute.estimatedCalculationTypes?.includes('AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION'),
          ) || emptyData,
        [mapper.calculationType4]:
          booleanToTextPipe.transform(
            !complianceRoute.estimatedCalculationTypes?.includes('ENERGY_CONSUMPTION_OVER_TWELVE_MONTHS'),
          ) || emptyData,
        [mapper.calculationType5]:
          booleanToTextPipe.transform(!complianceRoute.estimatedCalculationTypes?.includes('NONE_OF_THE_ABOVE')) ||
          emptyData,
        [mapper.areTwelveMonthsVerifiableDataUsed]:
          booleanToTextPipe.transform(complianceRoute.areTwelveMonthsVerifiableDataUsed) || emptyData,
        [mapper.areEstimationMethodsRecorded]:
          skipQuestionPipe.transform(complianceRoute.areEstimationMethodsRecorded) || emptyData,
        [mapper.energyConsumptionProfilingUsed]:
          notApplicablePipe.transform(complianceRoute.energyConsumptionProfilingUsed) || emptyData,
        [mapper.areEnergyConsumptionProfilingMethodsRecorded]:
          skipQuestionPipe.transform(complianceRoute.areEnergyConsumptionProfilingMethodsRecorded) || emptyData,
        [mapper.isEnergyConsumptionProfilingNotUsedRecorded]:
          skipQuestionPipe.transform(complianceRoute.isEnergyConsumptionProfilingNotUsedRecorded) || emptyData,
        [mapper.energyAuditDescription]: audit.description,
        [mapper.energyAuditNumberOfSitesCovered]: audit.numberOfSitesCovered?.toString() || emptyData,
        [mapper.energyAuditNumberOfSitesVisited]: audit.numberOfSitesVisited?.toString() || emptyData,
        [mapper.energyAuditReason]: audit.reason,
      });
    });
  });

  return complianceRouteData;
};

const createEnergyConsumptionTabData = (results: NocReportResult['nocs']) => {
  const mapper = energyConsumptionDetailsHeaderMap;
  const energyConsumptionData: Array<{ [x: string]: string }> = [];

  filteredNocs(results).forEach((res) => {
    const {
      totalEnergyConsumption,
      significantEnergyConsumptionExists,
      significantEnergyConsumption,
      energyIntensityRatioData,
      additionalInformationExists,
      additionalInformation,
    } = res.noc.energyConsumptionDetails || {};

    const maxIntensityRatios = Math.max(
      energyIntensityRatioData?.buildings?.energyIntensityRatios?.length ?? 0,
      energyIntensityRatioData?.transport?.energyIntensityRatios?.length ?? 0,
      energyIntensityRatioData?.industrialProcesses?.energyIntensityRatios?.length ?? 0,
      energyIntensityRatioData?.otherProcesses?.energyIntensityRatios?.length ?? 0,
    );

    let i = 0;
    do {
      energyConsumptionData.push({
        ...getNocBasicData(res),
        [mapper.totalEnergyConsumption]:
          totalEnergyConsumption?.total != null ? `${totalEnergyConsumption.total}` : emptyData,
        [mapper.significantEnergyConsumptionExists]: booleanToTextPipe.transform(significantEnergyConsumptionExists),
        [mapper.significantEnergyConsumptionTotal]:
          significantEnergyConsumption?.total != null
            ? `${significantEnergyConsumption.total} kWh (${significantEnergyConsumption.significantEnergyConsumptionPct}%)`
            : emptyData,
        ...(energyIntensityRatioData?.buildings?.energyIntensityRatios?.length > i
          ? {
              [mapper.buildingsIntensityRatio]: `${energyIntensityRatioData.buildings.energyIntensityRatios[i].ratio}`,
              [mapper.buildingsIntensityUnit]: energyIntensityRatioData.buildings.energyIntensityRatios[i].unit,
              [mapper.buildingsIntensityInfo]: energyIntensityRatioData.buildings?.additionalInformation || emptyData,
            }
          : {
              [mapper.buildingsIntensityRatio]: emptyData,
              [mapper.buildingsIntensityUnit]: emptyData,
              [mapper.buildingsIntensityInfo]: emptyData,
            }),
        ...(energyIntensityRatioData?.transport?.energyIntensityRatios?.length > i
          ? {
              [mapper.transportIntensityRatio]: `${energyIntensityRatioData.transport.energyIntensityRatios[i].ratio}`,
              [mapper.transportIntensityUnit]: energyIntensityRatioData.transport.energyIntensityRatios[i].unit,
              [mapper.transportIntensityInfo]: energyIntensityRatioData.transport?.additionalInformation || emptyData,
            }
          : {
              [mapper.transportIntensityRatio]: emptyData,
              [mapper.transportIntensityUnit]: emptyData,
              [mapper.transportIntensityInfo]: emptyData,
            }),
        ...(energyIntensityRatioData?.industrialProcesses?.energyIntensityRatios?.length > i
          ? {
              [mapper.industrialIntensityRatio]: `${energyIntensityRatioData.industrialProcesses.energyIntensityRatios[i].ratio}`,
              [mapper.industrialIntensityUnit]:
                energyIntensityRatioData.industrialProcesses.energyIntensityRatios[i].unit,
              [mapper.industrialIntensityInfo]:
                energyIntensityRatioData.industrialProcesses?.additionalInformation || emptyData,
            }
          : {
              [mapper.industrialIntensityRatio]: emptyData,
              [mapper.industrialIntensityUnit]: emptyData,
              [mapper.industrialIntensityInfo]: emptyData,
            }),
        ...(energyIntensityRatioData?.otherProcesses?.energyIntensityRatios?.length > i
          ? {
              [mapper.otherIntensityRatio]: `${energyIntensityRatioData.otherProcesses.energyIntensityRatios[i].ratio}`,
              [mapper.otherIntensityUnit]: energyIntensityRatioData.otherProcesses.energyIntensityRatios[i].unit,
              [mapper.otherIntensityInfo]: energyIntensityRatioData.otherProcesses?.additionalInformation || emptyData,
            }
          : {
              [mapper.otherIntensityRatio]: emptyData,
              [mapper.otherIntensityUnit]: emptyData,
              [mapper.otherIntensityInfo]: emptyData,
            }),
        [mapper.additionalInformationExists]: booleanToTextPipe.transform(additionalInformationExists),
        [mapper.additionalInformation]: additionalInformation || emptyData,
      });

      i++;
    } while (i < maxIntensityRatios);
  });

  return energyConsumptionData;
};

const createEnergySavingsOpportunitiesTabData = (results: NocReportResult['nocs']) => {
  const mapper = energySavingsOpportunitiesHeaderMap;
  const energySavingsOpportunitiesData = filteredNocs(results).map((res) => {
    const { implementationEnergyConsumption, energyConsumption, energySavingsCategories } =
      res.noc.energySavingsOpportunities || {};

    return {
      ...getNocBasicData(res),
      [mapper.implementationEnergyConsumptionTotalKwh]:
        implementationEnergyConsumption?.energyConsumption != null
          ? `${implementationEnergyConsumption.energyConsumption} kWh`
          : emptyData,
      [mapper.implementationEnergyConsumptionTotalCost]:
        implementationEnergyConsumption?.energyCost != null
          ? `£${implementationEnergyConsumption.energyCost}`
          : emptyData,
      [mapper.energyConsumptionTotalKwh]:
        energyConsumption?.energyConsumptionTotal != null
          ? `${energyConsumption.energyConsumptionTotal} kWh`
          : emptyData,
      [mapper.energyConsumptionTotalCost]:
        energyConsumption?.energyCostTotal != null ? `£${energyConsumption.energyCostTotal}` : emptyData,
      [mapper.energySavingsCategoriesTotalKwh]:
        energySavingsCategories?.energyConsumptionTotal != null
          ? `${energySavingsCategories.energyConsumptionTotal} kWh`
          : emptyData,
      [mapper.energySavingsCategoriesTotalCost]:
        energySavingsCategories?.energyCostTotal != null ? `£${energySavingsCategories.energyCostTotal}` : emptyData,
    };
  });

  return energySavingsOpportunitiesData;
};

const createAlternativeRouteComplianceTabData = (results: NocReportResult['nocs']) => {
  const mapper = alternativeComplianceRoutesHeaderMap;
  const alternativeRouteComplianceData: Array<{ [x: string]: string }> = [];

  filteredNocs(results).forEach((res) => {
    const {
      totalEnergyConsumptionReduction,
      energyConsumptionReduction,
      energyConsumptionReductionCategories,
      assets,
      iso50001CertificateDetails,
      decCertificatesDetails,
      gdaCertificatesDetails,
    } = res.noc.alternativeComplianceRoutes || {};

    const commonData = {
      [mapper.totalEnergyConsumptionReductionTotalKwh]:
        totalEnergyConsumptionReduction?.energyConsumption != null
          ? `${totalEnergyConsumptionReduction.energyConsumption} kWh`
          : emptyData,
      [mapper.totalEnergyConsumptionReductionTotalCost]: totalEnergyConsumptionReduction?.energyCost
        ? `£${totalEnergyConsumptionReduction.energyCost}`
        : emptyData,
      [mapper.energyConsumptionReductionTotalKwh]:
        energyConsumptionReduction?.energyConsumptionTotal != null
          ? `${energyConsumptionReduction.energyConsumptionTotal} kWh`
          : emptyData,
      [mapper.energyConsumptionReductionTotalCost]: energyConsumptionReduction?.energyCostTotal
        ? `£${energyConsumptionReduction.energyCostTotal}`
        : emptyData,
      [mapper.energyConsumptionReductionCategoriesTotalKwh]:
        energyConsumptionReductionCategories?.energyConsumptionTotal != null
          ? `${energyConsumptionReductionCategories.energyConsumptionTotal} kWh`
          : emptyData,
      [mapper.energyConsumptionReductionCategoriesTotalCost]: energyConsumptionReductionCategories?.energyCostTotal
        ? `£${energyConsumptionReductionCategories.energyCostTotal}`
        : emptyData,
      [mapper.assetsIso50001]: assets?.iso50001 || emptyData,
      [mapper.assetsDec]: assets?.dec || emptyData,
      [mapper.assetsGda]: assets?.gda || emptyData,
      [mapper.iso50001CertificateDetailsCertificateNumber]: emptyData,
      [mapper.decCertificatesDetailsCertificateNumber]: emptyData,
      [mapper.gdaCertificatesDetailsCertificateNumber]: emptyData,
      [mapper.validFrom]: emptyData,
      [mapper.validUntil]: emptyData,
    };

    if (!res.noc.alternativeComplianceRoutes) {
      alternativeRouteComplianceData.push({
        ...getNocBasicData(res),
        ...commonData,
      });
    } else {
      if (iso50001CertificateDetails?.certificateNumber) {
        alternativeRouteComplianceData.push({
          ...getNocBasicData(res),
          ...commonData,
          [mapper.iso50001CertificateDetailsCertificateNumber]: iso50001CertificateDetails.certificateNumber,
          [mapper.validFrom]: govukDatePipe.transform(iso50001CertificateDetails.validFrom),
          [mapper.validUntil]: govukDatePipe.transform(iso50001CertificateDetails.validUntil),
        });
      }

      decCertificatesDetails?.certificateDetails.forEach((certificate) => {
        alternativeRouteComplianceData.push({
          ...getNocBasicData(res),
          ...commonData,
          [mapper.decCertificatesDetailsCertificateNumber]: certificate.certificateNumber,
          [mapper.validFrom]: govukDatePipe.transform(certificate.validFrom),
          [mapper.validUntil]: govukDatePipe.transform(certificate.validUntil),
        });
      });

      gdaCertificatesDetails?.certificateDetails.forEach((certificate) => {
        alternativeRouteComplianceData.push({
          ...getNocBasicData(res),
          ...commonData,
          [mapper.gdaCertificatesDetailsCertificateNumber]: certificate.certificateNumber,
          [mapper.validFrom]: govukDatePipe.transform(certificate.validFrom),
          [mapper.validUntil]: govukDatePipe.transform(certificate.validUntil),
        });
      });
    }
  });

  return alternativeRouteComplianceData;
};

const createEnergySavingsAchievedTabData = (results: NocReportResult['nocs']) => {
  const mapper = energySavingsAchievedHeaderMap;

  const energySavingsAchievedData = filteredNocs(results).map((res) => {
    const {
      energySavingsEstimation,
      totalEnergySavingsEstimation,
      energySavingCategoriesExist,
      energySavingsCategories,
      energySavingsRecommendationsExist,
    } = res.noc.energySavingsAchieved || {};

    return {
      ...getNocBasicData(res),
      [mapper.totalEnergySavingsEstimation]: totalEnergySavingsEstimation?.toString() || emptyData,
      [mapper.energySavingsEstimationTotalKwh]:
        energySavingsEstimation?.total != null ? energySavingsEstimation.total.toString() : emptyData,
      [mapper.energySavingCategoriesExist]: skipQuestionPipe.transform(energySavingCategoriesExist) || emptyData,
      [mapper.energySavingsCategoriesTotalKwh]:
        energySavingsCategories?.total != null ? energySavingsCategories.total.toString() : emptyData,
      [mapper.energySavingsRecommendationsExist]:
        skipQuestionPipe.transform(energySavingsRecommendationsExist) || emptyData,
    };
  });

  return energySavingsAchievedData;
};

const createLeadAssessorTabData = (results: NocReportResult['nocs']) => {
  const mapper = leadAssessorHeaderMap;

  const leadAssessorData = filteredNocs(results).map((res) => {
    const { leadAssessorType, hasLeadAssessorConfirmation } = res.noc.leadAssessor || {};

    return {
      ...getNocBasicData(res),
      [mapper.leadAssessorType]: internalExternalPipe.transform(leadAssessorType) || emptyData,
      [mapper.hasLeadAssessorConfirmation]:
        hasLeadAssessorConfirmation != null
          ? hasLeadAssessorConfirmation
            ? 'Yes, the lead assessor reviewed and confirmed that the assessment meets the ESOS requirements'
            : 'Yes, the lead assessor reviewed but not confirmed that the assessment meets the ESOS requirements'
          : emptyData,
    };
  });

  return leadAssessorData;
};

const createResponsibleConfirmationTabData = (results: NocReportResult['nocs']) => {
  const mapper = confirmationsHeaderMap;

  const responsibleConfirmationData = filteredNocs(results).map((res) => {
    const {
      responsibilityAssessmentTypes,
      noEnergyResponsibilityAssessmentTypes,
      reviewAssessmentDate,
      secondResponsibleOfficerDetails,
    } = res.noc.confirmations || {};

    return {
      ...getNocBasicData(res),
      [mapper.hasResponsibleOfficerReview]:
        responsibilityAssessmentTypes?.length > 0 ? booleanToTextPipe.transform(true) : emptyData,
      [mapper.hasNoResponsibleOfficerReview]:
        noEnergyResponsibilityAssessmentTypes?.length > 0 ? booleanToTextPipe.transform(true) : emptyData,
      [mapper.reviewAssessmentDate]: govukDatePipe.transform(reviewAssessmentDate) || emptyData,
      [mapper.hasSecondResponsibleOfficerReview]: booleanToTextPipe.transform(
        !!secondResponsibleOfficerDetails?.lastName,
      ),
    };
  });

  return responsibleConfirmationData;
};

import { inject } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { AlternativeComplianceRoutes } from 'esos-api';

/**
 * Route A (Not Applicable to Alternative Compliance Routes)
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'RESPONSIBLE'
 * reportingObligationDetails.complianceRouteDistribution.energyAuditsPct >= 95
 * reportingObligationDetails.complianceRouteDistribution.energyNotAuditedPct >= 0 & <=5
 *
 * reportingObligationCategory = 'ESOS_ENERGY_ASSESSMENTS_95_TO_100
 */

/**
 * Route B
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'RESPONSIBLE'
 * reportingObligationDetails.complianceRouteDistribution.iso50001Pct = 100
 *
 * reportingObligationCategory = 'ISO_50001_COVERING_ENERGY_USAGE'
 */

/**
 * Route C
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'RESPONSIBLE'
 * reportingObligationDetails.complianceRouteDistribution.energyAuditsPct >= 0 & < 95
 * AtLeastOne:
 *  reportingObligationDetails.complianceRouteDistribution.iso50001Pct > 0
 *  reportingObligationDetails.complianceRouteDistribution.displayEnergyCertificatePct > 0
 *  reportingObligationDetails.complianceRouteDistribution.greenDealAssessmentPct > 0
 *
 * reportingObligationCategory = 'PARTIAL_ENERGY_ASSESSMENTS'
 */

/**
 * Route D (Not Applicable to Alternative Compliance Routes)
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'NOT_RESPONSIBLE'
 *
 * reportingObligationCategory = 'ZERO_ENERGY'
 */

/**
 * Route E
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'RESPONSIBLE_BUT_LESS_THAN_40000_KWH'
 *
 * reportingObligationCategory = 'LESS_THAN_40000_KWH_PER_YEAR'
 *
 */

/**
 * Route F
 * reportingObligation.qualificationType = 'QUALIFY'
 * reportingObligationDetails.energyResponsibilityType = 'RESPONSIBLE'
 * reportingObligationDetails.complianceRouteDistribution.energyAuditsPct = 0
 *
 * reportingObligationCategory = 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'
 */

/**
 * Route H (Not Applicable to Alternative Compliance Routes)
 * reportingObligation.qualificationType = 'NOT_QUALIFY'
 *
 * reportingObligationCategory = 'NOT_QUALIFY'
 */

/**
 * Calculates whether Wizard for AlternativeComplianceRoutes is complete
 * Only applies to Routes
 *  - Route B ('ISO_50001_COVERING_ENERGY_USAGE')
 *  - Route C ('PARTIAL_ENERGY_ASSESSMENTS')
 *  - Route E ('LESS_THAN_40000_KWH_PER_YEAR')
 *  - Route F ('ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100')
 */
export const isWizardCompleted = (alternativeComplianceRoutes?: AlternativeComplianceRoutes) => {
  const store = inject(RequestTaskStore);
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const complianceRouteDistribution = store.select(notificationQuery.selectReportingObligation)()
    .reportingObligationDetails.complianceRouteDistribution;

  const totalEnergyConsumptionReductionCompleted = !!alternativeComplianceRoutes?.totalEnergyConsumptionReduction;

  const energyConsumptionReductionCompleted = !!alternativeComplianceRoutes?.energyConsumptionReduction;

  const energyConsumptionReductionCategoriesCompleted =
    !!alternativeComplianceRoutes?.energyConsumptionReductionCategories;

  const assetsCompleted = !!alternativeComplianceRoutes?.assets;

  const iso50001CertificateDetailsCompleted =
    !!alternativeComplianceRoutes?.iso50001CertificateDetails || complianceRouteDistribution.iso50001Pct === 0;

  const decCertificatesDetailsCompleted =
    !!alternativeComplianceRoutes?.decCertificatesDetails ||
    complianceRouteDistribution.displayEnergyCertificatePct === 0;

  const gdaCertificatesDetailsCompleted =
    !!alternativeComplianceRoutes?.gdaCertificatesDetails || complianceRouteDistribution.greenDealAssessmentPct === 0;

  switch (reportingObligationCategory) {
    /**
     * Route B
     */
    case 'ISO_50001_COVERING_ENERGY_USAGE':
      return totalEnergyConsumptionReductionCompleted && assetsCompleted && iso50001CertificateDetailsCompleted;

    /**
     * Route C, E, F
     */
    case 'PARTIAL_ENERGY_ASSESSMENTS':
    case 'LESS_THAN_40000_KWH_PER_YEAR':
    case 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100':
      return (
        totalEnergyConsumptionReductionCompleted &&
        energyConsumptionReductionCompleted &&
        energyConsumptionReductionCategoriesCompleted &&
        assetsCompleted &&
        iso50001CertificateDetailsCompleted &&
        decCertificatesDetailsCompleted &&
        gdaCertificatesDetailsCompleted
      );

    default:
      return false;
  }
};

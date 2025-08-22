import { inject } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';

import { ComplianceRouteDistribution, ReportingObligation, ReportingObligationDetails } from 'esos-api';

import { notificationQuery } from '../../+state/notification.selectors';

export function isWizardCompleted(): boolean {
  const reportingObligation = inject(RequestTaskStore).select(notificationQuery.selectReportingObligation)();
  if (!reportingObligation) {
    return false;
  }

  const details = reportingObligation?.reportingObligationDetails;
  const distribution = details?.complianceRouteDistribution;

  return (
    (qualificationType(reportingObligation) === 'NOT_QUALIFY' && !!noQualificationReason(reportingObligation)) ||
    (qualificationType(reportingObligation) === 'QUALIFY' &&
      qualificationReasons(details) != null &&
      !!energyResponsibility(details) &&
      ((energyResponsibility(details) !== 'NOT_RESPONSIBLE' && totalPct(distribution) === 100) ||
        energyResponsibility(details) === 'NOT_RESPONSIBLE'))
  );
}

export function qualificationType(reportingObligation: ReportingObligation): ReportingObligation['qualificationType'] {
  return reportingObligation?.qualificationType;
}

export function noQualificationReason(
  reportingObligation: ReportingObligation,
): ReportingObligation['noQualificationReason'] {
  return reportingObligation?.noQualificationReason;
}

export function qualificationReasons(
  details: ReportingObligationDetails,
): ReportingObligationDetails['qualificationReasonType'] {
  return details?.qualificationReasonType;
}

export function energyResponsibility(
  details: ReportingObligationDetails,
): ReportingObligationDetails['energyResponsibilityType'] {
  return details?.energyResponsibilityType;
}

export function totalPct(distribution: ComplianceRouteDistribution): number {
  return distribution?.totalPct;
}

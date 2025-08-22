import { ComplianceRoute } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';
import { showComplianceRouteQuestions } from './compliance-route.helper';

export const isWizardCompleted = (
  complianceRoute: ComplianceRoute,
  category: ReportingObligationCategory,
  energyAudits: number,
) => {
  const partsProhibitedFromDisclosingExist = complianceRoute?.partsProhibitedFromDisclosingExist;

  const isWizardCompletedRouteAOrRouteCOrRouteE =
    !!complianceRoute?.estimatedCalculationTypes &&
    ((complianceRoute?.areTwelveMonthsVerifiableDataUsed === false &&
      !!complianceRoute?.twelveMonthsVerifiableDataUsedReason) ||
      complianceRoute?.areTwelveMonthsVerifiableDataUsed === true) &&
    !!complianceRoute?.areEstimationMethodsRecorded &&
    !!complianceRoute?.energyConsumptionProfilingUsed &&
    (complianceRoute?.energyConsumptionProfilingUsed === 'YES'
      ? complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded != null
      : complianceRoute?.isEnergyConsumptionProfilingNotUsedRecorded != null) &&
    complianceRoute?.energyAudits?.length > 0 &&
    ((partsProhibitedFromDisclosingExist &&
      !!complianceRoute?.partsProhibitedFromDisclosing &&
      !!complianceRoute?.partsProhibitedFromDisclosingReason) ||
      partsProhibitedFromDisclosingExist === false);

  const isWizardCompletedRouteBOrRouteF =
    !showComplianceRouteQuestions(category, energyAudits) &&
    !!complianceRoute?.estimatedCalculationTypes &&
    !!complianceRoute?.areEstimationMethodsRecorded &&
    ((partsProhibitedFromDisclosingExist &&
      !!complianceRoute?.partsProhibitedFromDisclosing &&
      !!complianceRoute?.partsProhibitedFromDisclosingReason) ||
      partsProhibitedFromDisclosingExist === false);

  return isWizardCompletedRouteAOrRouteCOrRouteE || isWizardCompletedRouteBOrRouteF;
};

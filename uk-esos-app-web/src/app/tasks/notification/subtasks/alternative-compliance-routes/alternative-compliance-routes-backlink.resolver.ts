import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { isDecEnabled, isIso50001Enabled, WizardStep } from './alternative-compliance-routes.helper';

export const alternativeComplianceRoutesBacklinkResolver = (currentStepRoute: string) => {
  return () => {
    const store = inject(RequestTaskStore);
    const router = inject(Router);

    const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
    const complianceRouteDistribution = store.select(notificationQuery.selectReportingObligation)()
      .reportingObligationDetails.complianceRouteDistribution;
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    if (isChangeClicked) {
      return WizardStep.SUMMARY;
    } else {
      switch (currentStepRoute) {
        case WizardStep.ENERGY_CONSUMPTION_REDUCTION:
          return `../${WizardStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION}`;

        case WizardStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES:
          return `../${WizardStep.ENERGY_CONSUMPTION_REDUCTION}`;

        case WizardStep.ASSETS:
          return reportingObligationCategory !== 'ISO_50001_COVERING_ENERGY_USAGE'
            ? `../${WizardStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES}`
            : `../${WizardStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION}`;

        case WizardStep.ISO_50001_CERTIFICATE_DETAILS:
          return `../${WizardStep.ASSETS}`;

        case WizardStep.DEC_CERTIFICATES_DETAILS:
          return isIso50001Enabled(complianceRouteDistribution)
            ? `../${WizardStep.ISO_50001_CERTIFICATE_DETAILS}`
            : `../${WizardStep.ASSETS}`;

        case WizardStep.GDA_CERTIFICATES_DETAILS:
          return isDecEnabled(complianceRouteDistribution)
            ? `../${WizardStep.DEC_CERTIFICATES_DETAILS}`
            : isIso50001Enabled(complianceRouteDistribution)
            ? `../${WizardStep.ISO_50001_CERTIFICATE_DETAILS}`
            : `../${WizardStep.ASSETS}`;

        default:
          return WizardStep.SUMMARY;
      }
    }
  };
};

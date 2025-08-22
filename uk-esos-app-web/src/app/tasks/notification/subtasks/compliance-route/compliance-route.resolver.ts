import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { showComplianceRouteQuestions, WizardStep } from './compliance-route.helper';

export const resolveComplianceRouteBackLink = (currentStepRoute: string) => {
  return () => {
    const store = inject(RequestTaskStore);
    const router = inject(Router);
    const energyConsumptionProfilingUsed = store.select(notificationQuery.selectComplianceRoute)()
      ?.energyConsumptionProfilingUsed;
    const category = store.select(notificationQuery.selectReportingObligationCategory)();
    const energyAudits = store.select(notificationQuery.selectReportingObligation)().reportingObligationDetails
      .complianceRouteDistribution.energyAuditsPct;
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    const showQuestions = showComplianceRouteQuestions(category, energyAudits);

    if (isChangeClicked) {
      return WizardStep.SUMMARY;
    } else {
      switch (currentStepRoute) {
        case WizardStep.ESTIMATION_METHODS_RECORDED:
          return showQuestions ? `../${WizardStep.TWELVE_MONTHS_VERIFIABLE_DATA}` : `../${WizardStep.DATA_ESTIMATED}`;

        case WizardStep.ENERGY_AUDITS:
          return energyConsumptionProfilingUsed === 'YES'
            ? `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED}`
            : `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_NOT_USED_RECORDED}`;

        case WizardStep.PROHIBITED_DISCLOSING:
          return showQuestions ? `../${WizardStep.ENERGY_AUDITS}` : `../${WizardStep.ESTIMATION_METHODS_RECORDED}`;

        default:
          return WizardStep.SUMMARY;
      }
    }
  };
};

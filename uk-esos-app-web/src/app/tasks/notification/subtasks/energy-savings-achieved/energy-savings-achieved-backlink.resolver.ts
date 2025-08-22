import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { EnergySavingsAchievedWizardStep } from './energy-savings-achieved.helper';

export const energySavingsAchievedBacklinkResolver = (currentStepRoute: string) => {
  return () => {
    const store = inject(RequestTaskStore);
    const router = inject(Router);
    const energySavingsAchieved = store.select(notificationQuery.selectEnergySavingsAchieved)();
    const navigateToTotal = store.select(notificationQuery.selectReportingObligationCategory)();
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    if (isChangeClicked) {
      return EnergySavingsAchievedWizardStep.SUMMARY;
    } else {
      switch (currentStepRoute) {
        case EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST:
          if (navigateToTotal === 'ISO_50001_COVERING_ENERGY_USAGE') {
            return `../${EnergySavingsAchievedWizardStep.STEP_ESTIMATE_TOTAL}`;
          } else {
            return energySavingsAchieved.energySavingCategoriesExist === 'YES'
              ? `../${EnergySavingsAchievedWizardStep.STEP_CATEGORIES}`
              : `../${EnergySavingsAchievedWizardStep.STEP_CATEGORIES_EXIST}`;
          }

        case EnergySavingsAchievedWizardStep.STEP_CATEGORIES:
          return `../${EnergySavingsAchievedWizardStep.STEP_CATEGORIES_EXIST}`;

        case EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS:
          return `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST}`;

        case EnergySavingsAchievedWizardStep.STEP_DETAILS:
          return energySavingsAchieved.energySavingsRecommendationsExist === 'YES'
            ? `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS}`
            : `../${EnergySavingsAchievedWizardStep.STEP_RECOMMENDATIONS_EXIST}`;

        default:
          return EnergySavingsAchievedWizardStep.SUMMARY;
      }
    }
  };
};

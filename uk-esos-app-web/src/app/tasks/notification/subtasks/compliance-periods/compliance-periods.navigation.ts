import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const compliancePeriodBackLinkResolver = (summaryRoute: string, previousStepRoute: string) => {
  return () => {
    const router = inject(Router);
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;
    return isChangeClicked ? summaryRoute : `../${previousStepRoute}`;
  };
};

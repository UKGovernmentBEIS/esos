import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { OrganisationStructureWizardStep } from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';

export const organisationStructureListRouteBacklinkResolver = () => {
  return () => {
    const store = inject(RequestTaskStore);
    const router = inject(Router);

    const organisationStructure = store.select(notificationQuery.selectOrganisationStructure)();
    const isChangeClicked = !!router.getCurrentNavigation().finalUrl.queryParams?.change;

    if (isChangeClicked) {
      return OrganisationStructureWizardStep.SUMMARY;
    } else if (organisationStructure?.isNonComplyingUndertakingsIncluded) {
      return `../${OrganisationStructureWizardStep.UNDERTAKING_LIST}`;
    } else {
      return `../${OrganisationStructureWizardStep.INCLUDE_UNDERTAKINGS}`;
    }
  };
};

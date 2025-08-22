import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { OrganisationStructureWizardStep } from './organisation-structure.helper';
import { isWizardCompleted } from './organisation-structure.wizard';

export const canActivateOrganisationStructure: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const change = route.queryParamMap.get('change') === 'true';
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || change || createUrlTreeFromSnapshot(route, [OrganisationStructureWizardStep.SUMMARY]);
};

export const canEditOrganisation: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const organisationStructure = store.select(notificationQuery.selectOrganisationStructure)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const index = +route.paramMap.get('index');

  const canEdit =
    index &&
    organisationStructure.organisationsAssociatedWithRU.length &&
    !!organisationStructure.organisationsAssociatedWithRU[index - 1];

  return (isEditable && canEdit) || createUrlTreeFromSnapshot(route, [`../../${OrganisationStructureWizardStep.LIST}`]);
};

export const canActivateOrganisationStructureSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const organisationStructure = store.select(notificationQuery.selectOrganisationStructure)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(organisationStructure)) ||
    createUrlTreeFromSnapshot(route, ['./', OrganisationStructureWizardStep.HIGHEST_PARENT])
  );
};

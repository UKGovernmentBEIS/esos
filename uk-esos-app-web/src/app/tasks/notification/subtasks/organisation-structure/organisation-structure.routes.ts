import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { organisationStructureListRouteBacklinkResolver } from '@tasks/notification/subtasks/organisation-structure/organisation-structure-list-route-backlink.resolver';
import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateOrganisationStructure,
  canActivateOrganisationStructureSummary,
  canEditOrganisation,
} from './organisation-structure.guard';
import { OrganisationStructureWizardStep } from './organisation-structure.helper';

export const ORGANISATION_STRUCTURE_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateOrganisationStructureSummary],
        title: 'Organisation structure',
        data: { breadcrumb: 'Organisation structure' },
        loadComponent: () => import('./summary').then((c) => c.OrganisationStructureSummaryComponent),
      },
      {
        path: OrganisationStructureWizardStep.HIGHEST_PARENT,
        canActivate: [canActivateOrganisationStructure],
        title: 'Is the responsible undertaking a highest UK parent?',
        loadComponent: () => import('./highest-parent').then((c) => c.HighestParentComponent),
      },
      {
        path: OrganisationStructureWizardStep.INCLUDE_UNDERTAKINGS,
        canActivate: [canActivateOrganisationStructure],
        title: 'Did the responsible undertaking’s group include any undertakings?',
        resolve: {
          backlink: backlinkResolver(
            OrganisationStructureWizardStep.SUMMARY,
            OrganisationStructureWizardStep.HIGHEST_PARENT,
          ),
        },
        loadComponent: () => import('./include-undertakings').then((c) => c.IncludeUndertakingsComponent),
      },
      {
        path: OrganisationStructureWizardStep.UNDERTAKING_LIST,
        canActivate: [canActivateOrganisationStructure],
        title: 'Provide the organisation names of the undertakings',
        resolve: {
          backlink: backlinkResolver(
            OrganisationStructureWizardStep.SUMMARY,
            OrganisationStructureWizardStep.INCLUDE_UNDERTAKINGS,
          ),
        },
        loadComponent: () => import('./undertaking-list').then((c) => c.UndertakingListComponent),
      },
      {
        path: OrganisationStructureWizardStep.LIST,
        title:
          "Add information on the organisations complying as one participant in the responsible undertaking's notification for its corporate group",
        resolve: {
          backlink: organisationStructureListRouteBacklinkResolver(),
        },
        loadComponent: () => import('./list').then((c) => c.OrganisationStructureListComponent),
      },
      {
        path: OrganisationStructureWizardStep.ADD,
        title: 'Add an organisation',
        data: { backlink: `../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./add-edit').then((c) => c.OrganisationStructureAddEditComponent),
      },
      {
        path: OrganisationStructureWizardStep.UPLOAD_CSV,
        title: 'Upload CSV',
        data: { backlink: `../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./upload-csv').then((c) => c.UploadCsvComponent),
      },
      {
        path: `:index/${OrganisationStructureWizardStep.EDIT}`,
        canActivate: [canEditOrganisation],
        title: 'Edit an organisation',
        data: { backlink: `../../${OrganisationStructureWizardStep.LIST}` },
        loadComponent: () => import('./add-edit').then((c) => c.OrganisationStructureAddEditComponent),
      },
    ],
  },
];

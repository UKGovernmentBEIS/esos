import { Routes } from '@angular/router';

import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import {
  canActivateResponsibleUndertaking,
  canActivateResponsibleUndertakingSummary,
} from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.guard';
import { ResponsibleUndertakingWizardStep } from '@tasks/notification/subtasks/responsible-undertaking/responsible-undertaking.helper';
import { backlinkResolver } from '@tasks/task-navigation';

export const RESPONSIBLE_UNDERTAKING_ROUTES: Routes = [
  {
    path: '',
    title: `${responsibleUndertakingMap.title}`,
    data: {
      breadcrumb: `${responsibleUndertakingMap.title}`,
    },
    canActivate: [canActivateResponsibleUndertakingSummary],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/summary').then((c) => c.SummaryComponent),
  },
  {
    path: ResponsibleUndertakingWizardStep.REGISTRATION_NUMBER,
    title: 'Is the UK organisation registered at Companies House?',
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/organisation-registration-number').then(
        (c) => c.OrganisationRegistrationNumberComponent,
      ),
  },
  {
    path: ResponsibleUndertakingWizardStep.ORGANISATION_DETAILS,
    title: responsibleUndertakingMap.organisationDetails.title,
    canActivate: [canActivateResponsibleUndertaking],
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.REGISTRATION_NUMBER,
      ),
    },
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/organisation-details').then(
        (c) => c.OrganisationDetailsComponent,
      ),
  },
  {
    path: ResponsibleUndertakingWizardStep.TRADING_DETAILS,
    title: responsibleUndertakingMap.tradingDetails.title,
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.ORGANISATION_DETAILS,
      ),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/trading-details').then(
        (c) => c.TradingDetailsComponent,
      ),
  },
  {
    path: ResponsibleUndertakingWizardStep.ORGANISATION_CONTACT_DETAILS,
    title: responsibleUndertakingMap.organisationContactDetails.title,
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.TRADING_DETAILS,
      ),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/organisation-contact-details').then(
        (c) => c.OrganisationContactDetailsComponent,
      ),
  },
  {
    path: ResponsibleUndertakingWizardStep.NOTIFICATION,
    title: responsibleUndertakingMap.organisationContactDetails.title,
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.ORGANISATION_CONTACT_DETAILS,
      ),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/notification').then((c) => c.NotificationComponent),
  },
  {
    path: ResponsibleUndertakingWizardStep.HAS_OVERSEAS_PARENT_DETAILS,
    title: responsibleUndertakingMap.hasOverseasParentDetails.title,
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.NOTIFICATION,
      ),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details-question').then(
        (c) => c.OverseasParentDetailsQuestionComponent,
      ),
  },
  {
    path: ResponsibleUndertakingWizardStep.OVERSEAS_PARENT_DETAILS,
    title: responsibleUndertakingMap.overseasParentDetails.title,
    resolve: {
      backlink: backlinkResolver(
        ResponsibleUndertakingWizardStep.SUMMARY,
        ResponsibleUndertakingWizardStep.HAS_OVERSEAS_PARENT_DETAILS,
      ),
    },
    canActivate: [canActivateResponsibleUndertaking],
    loadComponent: () =>
      import('@tasks/notification/subtasks/responsible-undertaking/overseas-parent-details').then(
        (c) => c.OverseasParentDetailsComponent,
      ),
  },
];

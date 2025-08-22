import { Routes } from '@angular/router';

import { backlinkResolver } from '@tasks/task-navigation';

import { canActivateConfirmation, canActivateConfirmationSummary } from './confirmation.guard';
import { WizardStep } from './confirmation.helper';
import { confirmationBacklinkResolver } from './confirmation-backlink.resolver';

export const CONFIRMATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [canActivateConfirmationSummary],
    data: { breadcrumb: true },
    title: 'Responsible officer confirmation',
    loadComponent: () => import('./summary/summary.component'),
  },
  {
    path: 'responsibility-assessment-types',
    canActivate: [canActivateConfirmation],
    title: 'Responsible officer review',
    loadComponent: () => import('./responsibility-assessment-types/responsibility-assessment-types.component'),
  },
  {
    path: 'no-energy-responsibility-assessment-types',
    canActivate: [canActivateConfirmation],
    title: 'Responsible officer review',
    loadComponent: () =>
      import('./no-energy-responsibility-assessment-types/no-energy-responsibility-assessment-types.component'),
  },
  {
    path: 'responsible-officer-details',
    resolve: { backlink: confirmationBacklinkResolver(WizardStep.STEP_OFFICER_DETAILS) },
    canActivate: [canActivateConfirmation],
    title: 'Details of the responsible officer',
    loadComponent: () => import('./responsible-officer-details/responsible-officer-details.component'),
  },
  {
    path: 'review-assessment-date',
    resolve: {
      backlink: backlinkResolver(WizardStep.STEP_SUMMARY, WizardStep.STEP_OFFICER_DETAILS),
    },
    canActivate: [canActivateConfirmation],
    title: 'When did the responsible officer review the ESOS assessment recommendations?',
    loadComponent: () => import('./review-assessment-date/review-assessment-date.component'),
  },
  {
    path: 'second-responsible-officer-energy-types',
    resolve: {
      backlink: backlinkResolver(WizardStep.STEP_SUMMARY, WizardStep.STEP_ASSESSMENT_DATE),
    },
    canActivate: [canActivateConfirmation],
    title: 'Second responsible officer review',
    loadComponent: () =>
      import('./second-responsible-officer-energy-types/second-responsible-officer-energy-types.component'),
  },
  {
    path: 'second-responsible-officer-details',
    resolve: {
      backlink: backlinkResolver(WizardStep.STEP_SUMMARY, WizardStep.STEP_SECOND_OFFICER_TYPES),
    },
    canActivate: [canActivateConfirmation],
    title: 'Details of the second responsible officer',
    loadComponent: () => import('./second-responsible-officer-details/second-responsible-officer-details.component'),
  },
];

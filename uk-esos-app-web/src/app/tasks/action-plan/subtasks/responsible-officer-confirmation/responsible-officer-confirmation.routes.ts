import { Routes } from '@angular/router';

import { backlinkResolver } from '@tasks/task-navigation';

import { canActivateReview, canActivateSummary } from './responsible-officer-confirmation.guard';
import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
  ResponsibleOfficerConfirmationStepUrl,
} from './responsible-officer-confirmation.helper';
import { REVIEW_CONTENT } from './review/review-content';

export const RESPONSIBLE_OFFICER_CONFIRMATION_ROUTES: Routes = [
  {
    path: '',
    title: `${RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}`,
    data: { breadcrumb: `${RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}` },
    canActivate: [canActivateSummary],
    loadComponent: () =>
      import('@tasks/action-plan/subtasks/responsible-officer-confirmation/summary').then((c) => c.SummaryComponent),
  },
  {
    path: ResponsibleOfficerConfirmationStepUrl.REVIEW,
    title: REVIEW_CONTENT.title,
    data: { breadcrumb: `${RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}` },
    resolve: {
      backlink: backlinkResolver(ResponsibleOfficerConfirmationStepUrl.SUMMARY, '../../'),
    },
    canActivate: [canActivateReview],
    loadComponent: () =>
      import('@tasks/action-plan/subtasks/responsible-officer-confirmation/review').then((c) => c.ReviewComponent),
  },
];

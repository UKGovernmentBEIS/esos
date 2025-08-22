import { Routes } from '@angular/router';

import {
  ProgressUpdateResponsibleOfficerConfirmationStepUrl,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
  PU_REVIEW_CONTENT,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { backlinkResolver } from '@tasks/task-navigation';

import { canActivateReview, canActivateSummary } from './pu-responsible-officer-confirmation.guard';

export const PU_RESPONSIBLE_OFFICER_CONFIRMATION_ROUTES: Routes = [
  {
    path: '',
    title: `${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}`,
    data: { breadcrumb: `${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}` },
    canActivate: [canActivateSummary],
    loadComponent: () =>
      import('@tasks/progress-update-common/pu-responsible-officer-confirmation/summary').then(
        (c) => c.SummaryComponent,
      ),
  },
  {
    path: ProgressUpdateResponsibleOfficerConfirmationStepUrl.REVIEW,
    title: PU_REVIEW_CONTENT.title,
    data: { breadcrumb: `${PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE}` },
    resolve: {
      backlink: backlinkResolver(ProgressUpdateResponsibleOfficerConfirmationStepUrl.SUMMARY, '../../'),
    },
    canActivate: [canActivateReview],
    loadComponent: () =>
      import('@tasks/progress-update-common/pu-responsible-officer-confirmation/review').then((c) => c.ReviewComponent),
  },
];

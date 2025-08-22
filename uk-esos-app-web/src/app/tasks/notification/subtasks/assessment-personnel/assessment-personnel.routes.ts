import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { backlinkResolver } from '@tasks/task-navigation';

import {
  canActivateAssessmentPersonnel,
  canActivateAssessmentPersonnelSummary,
  canAlterAssessmentPersonnel,
} from './assessment-personnel.guard';
import { AssessmentPersonnelWizardStep } from './assessment-personnel.helper';

export const ASSESSMENT_PERSONNEL_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        canActivate: [canActivateAssessmentPersonnelSummary],
        title: 'Assessment personnel',
        data: { breadcrumb: 'Assessment personnel' },
        loadComponent: () => import('./personnel-summary/personnel-summary.component'),
      },
      {
        path: AssessmentPersonnelWizardStep.STEP_LIST,
        canActivate: [canActivateAssessmentPersonnel],
        title: 'Assessment personnel list',
        loadComponent: () => import('./personnel-list/personnel-list.component'),
      },
      {
        path: AssessmentPersonnelWizardStep.STEP_FORM,
        canActivate: [canActivateAssessmentPersonnel],
        title: 'Add personnel',
        data: { backlink: '../' },
        loadComponent: () => import('./personnel/personnel.component'),
      },
      {
        path: `:personIndex/${AssessmentPersonnelWizardStep.STEP_FORM}`,
        canActivate: [canActivateAssessmentPersonnel, canAlterAssessmentPersonnel],
        title: 'Edit personnel',
        resolve: {
          backlink: backlinkResolver(
            `../${AssessmentPersonnelWizardStep.SUMMARY}`,
            `../${AssessmentPersonnelWizardStep.STEP_LIST}`,
          ),
        },
        loadComponent: () => import('./personnel/personnel.component'),
      },
      {
        path: `:personIndex/${AssessmentPersonnelWizardStep.STEP_REMOVE}`,
        canActivate: [canActivateAssessmentPersonnel, canAlterAssessmentPersonnel],
        title: 'Delete personnel',
        data: { breadcrumb: 'Delete personnel' },
        loadComponent: () => import('./personnel-remove/personnel-remove.component'),
      },
    ],
  },
];

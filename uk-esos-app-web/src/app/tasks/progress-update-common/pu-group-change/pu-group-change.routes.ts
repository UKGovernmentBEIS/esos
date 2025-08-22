import { Routes } from '@angular/router';

import { backlinkResolver } from '@tasks/task-navigation';

import { PU_GROUP_CHANGE_FORM_CONTENT } from './group-change-form/group-change-form-content';
import { canActivateForm, canActivateSummary } from './pu-group-change.guard';
import { ProgressUpdateGroupChangeStepUrl, PU_GROUP_CHANGE_SUBTASK_TITLE } from './pu-group-change.helper';

export const PU_GROUP_CHANGE_ROUTES: Routes = [
  {
    path: '',
    title: PU_GROUP_CHANGE_SUBTASK_TITLE,
    data: { breadcrumb: PU_GROUP_CHANGE_SUBTASK_TITLE },
    canActivate: [canActivateSummary],
    loadComponent: () =>
      import('@tasks/progress-update-common/pu-group-change/summary').then((c) => c.SummaryComponent),
  },
  {
    path: ProgressUpdateGroupChangeStepUrl.FORM,
    title: PU_GROUP_CHANGE_FORM_CONTENT.title,
    data: { breadcrumb: PU_GROUP_CHANGE_SUBTASK_TITLE },
    resolve: {
      backlink: backlinkResolver(ProgressUpdateGroupChangeStepUrl.SUMMARY, '../../'),
    },
    canActivate: [canActivateForm],
    loadComponent: () =>
      import('@tasks/progress-update-common/pu-group-change/group-change-form').then((c) => c.GroupChangeFormComponent),
  },
];

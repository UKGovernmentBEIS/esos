import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { knownTaskTypeGuard } from '@accounts/shared/workflow-item/reinitiate-task';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { NoteFileDownloadComponent } from '@shared/components/note-file-download/note-file-download.component';

import { DeleteRequestNoteComponent } from './notes/delete-note/delete-request-note.component';
import { RequestNoteComponent } from './notes/note/request-note.component';
import { WorkflowItemComponent } from './workflow-item.component';
import { reinitiateTaskMap } from './workflow-related-create-actions/workflowCreateAction';

const routes: Routes = [
  {
    path: '',
    title: 'Workflow item',
    component: WorkflowItemComponent,
  },
  {
    path: 'tasks',
    loadChildren: () => import('@tasks/tasks.routes').then((r) => r.TASKS_ROUTES),
  },
  {
    path: 'timeline',
    loadChildren: () => import('@timeline/timeline.routes').then((r) => r.TIMELINE_ROUTES),
  },
  {
    path: 'reinitiate/:taskType',
    title: (route: ActivatedRouteSnapshot) => {
      const taskLabel = reinitiateTaskMap.find((item) => item.taskTypePath === route.paramMap.get('taskType'))?.label;
      return `Return ${taskLabel ?? 'task'} to participant`;
    },
    data: { breadcrumb: true },
    canActivate: [knownTaskTypeGuard],
    loadComponent: () =>
      import('@accounts/shared/workflow-item/reinitiate-task').then((c) => c.ReinitiateTaskComponent),
  },
  {
    path: 'notes',
    children: [
      {
        path: 'add',
        title: 'Add a note',
        data: { heading: 'Add a note', breadcrumb: true },
        component: RequestNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: ':noteId/edit',
        title: 'Edit a note',
        data: { heading: 'Edit a note', breadcrumb: true },
        component: RequestNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: ':noteId/delete',
        title: 'Delete a note',
        data: { breadcrumb: true },
        component: DeleteRequestNoteComponent,
        canDeactivate: [PendingRequestGuard],
      },
    ],
  },
  {
    path: 'file-download/:uuid',
    component: NoteFileDownloadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowItemRoutingModule {}

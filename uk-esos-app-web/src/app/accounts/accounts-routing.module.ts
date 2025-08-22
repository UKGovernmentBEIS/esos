import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { accountsPageGuard } from '@accounts/containers/accounts-page/accounts-page.guard';
import { uploadOrganisationAccountsGuard } from '@accounts/upload-organisation-accounts/upload-organisation-accounts.guard';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { NoteFileDownloadComponent } from '@shared/components/note-file-download/note-file-download.component';
import { FileDownloadComponent } from '@shared/file-download/file-download.component';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import {
  AccountComponent,
  AccountNoteComponent,
  AccountsPageComponent,
  AccountsStore,
  AccountStatusGuard,
  AddComponent as OperatorAddComponent,
  AppointComponent,
  AppointGuard,
  canActivateAccount,
  canDeactivateAccount,
  DeleteAccountNoteComponent,
  DeleteComponent as OperatorDeleteComponent,
  DeleteGuard as OperatorDeleteGuard,
  DetailsComponent as OperatorDetailsComponent,
  DetailsGuard as OperatorDetailsGuard,
  DisaggregatedStartComponent,
  PhasesComponent,
  ProcessActionsComponent,
  ReplaceGuard,
  resolveAccount,
} from '.';
import { UpdateOrganisationAccountStateProvider } from './store/update-organisation-account.state.provider';
import { UpdateAccountComponent } from './update-account/update-account.component';

const workflowDetailsRoutes: Routes = [
  {
    path: ':request-id',
    title: 'Workflow item',
    data: { breadcrumb: ({ requestId }) => requestId },
    resolve: { requestId: (route) => route.paramMap.get('request-id') },
    children: [
      {
        path: '',
        loadChildren: () => import('./shared/workflow-item/workflow-item.module').then((m) => m.WorkflowItemModule),
      },
    ],
  },
];

const routes: Routes = [
  {
    path: '',
    providers: [AccountsStore],
    canActivate: [accountsPageGuard],
    children: [
      { path: '', title: 'Organisation Accounts', component: AccountsPageComponent },
      {
        path: 'upload-organisation-accounts',
        title: 'Upload file with verified organisation accounts',
        data: { breadcrumb: true },
        canActivate: [uploadOrganisationAccountsGuard],
        loadComponent: () =>
          import('./upload-organisation-accounts/upload-organisation-accounts.component').then(
            (c) => c.UploadOrganisationAccountsComponent,
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./organisation-account-application/organisation-account-application.routes').then((r) => r.ROUTES),
      },
      {
        path: ':accountId',
        canActivate: [canActivateAccount],
        canDeactivate: [canDeactivateAccount],
        resolve: { name: resolveAccount },
        runGuardsAndResolvers: 'always',
        data: { breadcrumb: { resolveText: ({ name }) => name } },
        children: [
          {
            path: '',
            title: (route) => `Account ${route.parent?.data?.name}`,
            component: AccountComponent,
            canDeactivate: [PendingRequestGuard],
          },
          {
            path: 'permit/:permitId/:fileType/:uuid',
            component: FileDownloadComponent,
          },
          {
            path: 'update',
            providers: [
              {
                provide: ORGANISATION_ACCOUNT_STATE_PROVIDER,
                useClass: UpdateOrganisationAccountStateProvider,
              },
            ],
            data: { breadcrumb: 'Update account details' },
            title: 'Update account details',
            children: [
              {
                path: '',
                component: UpdateAccountComponent,
                canDeactivate: [PendingRequestGuard],
              },
              {
                path: 'details',
                redirectTo: '',
              },
            ],
          },
          {
            path: 'cancel',
            pathMatch: 'full',
            redirectTo: '',
          },
          {
            path: 'verification-body',
            children: [
              {
                path: 'appoint',
                title: 'Users, contacts and verifiers - Appoint a verifier',
                data: {
                  breadcrumb: true,
                },
                component: AppointComponent,
                canActivate: [AppointGuard],
                canDeactivate: [PendingRequestGuard],
              },
              {
                path: 'replace',
                title: 'Users, contacts and verifiers - Replace a verifier',
                data: {
                  breadcrumb: true,
                },
                component: AppointComponent,
                canActivate: [ReplaceGuard],
                canDeactivate: [PendingRequestGuard],
                resolve: { verificationBody: ReplaceGuard },
              },
            ],
          },
          {
            path: 'users',
            children: [
              {
                path: ':userId',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    title: 'User details',
                    data: {
                      breadcrumb: ({ user }) => `${user.firstName} ${user.lastName}`,
                    },
                    component: OperatorDetailsComponent,
                    canActivate: [OperatorDetailsGuard],
                    canDeactivate: [PendingRequestGuard],
                    resolve: { user: OperatorDetailsGuard },
                  },
                  {
                    path: 'delete',
                    title: 'Confirm that this user account will be deleted',
                    data: {
                      breadcrumb: ({ user }) => `Delete ${user.firstName} ${user.lastName}`,
                    },
                    component: OperatorDeleteComponent,
                    canActivate: [OperatorDeleteGuard],
                    canDeactivate: [PendingRequestGuard],
                    resolve: { user: OperatorDeleteGuard },
                  },
                  {
                    path: '2fa',
                    loadChildren: () => import('../two-fa/two-fa.module').then((m) => m.TwoFaModule),
                  },
                ],
              },
              {
                path: 'add/:userType',
                title: 'Users, contacts and verifiers - Add user',
                data: {
                  breadcrumb: true,
                },
                component: OperatorAddComponent,
                canActivate: [AccountStatusGuard],
                canDeactivate: [PendingRequestGuard],
              },
            ],
          },
          {
            path: 'process-actions',
            title: 'Account process actions',
            data: { breadcrumb: true, backlink: '../' },
            children: [
              { path: '', component: ProcessActionsComponent, canDeactivate: [PendingRequestGuard] },
              {
                path: 'disaggregated-start',
                component: DisaggregatedStartComponent,
                canDeactivate: [PendingRequestGuard],
              },
            ],
          },
          {
            path: 'workflows',
            children: workflowDetailsRoutes,
          },
          {
            path: 'phases',
            children: workflowDetailsRoutes,
          },
          {
            path: 'reports',
            title: 'Reports',
            data: { breadcrumb: true },
            component: PhasesComponent,
          },
          {
            path: 'notes',
            children: [
              {
                path: 'add',
                title: 'Add a note',
                data: { heading: 'Add a note', breadcrumb: true },
                component: AccountNoteComponent,
                canDeactivate: [PendingRequestGuard],
              },
              {
                path: ':noteId/edit',
                title: 'Edit a note',
                data: { heading: 'Edit a note', breadcrumb: true },
                component: AccountNoteComponent,
                canDeactivate: [PendingRequestGuard],
              },
              {
                path: ':noteId/delete',
                title: 'Delete a note',
                data: { breadcrumb: true },
                component: DeleteAccountNoteComponent,
                canDeactivate: [PendingRequestGuard],
              },
            ],
          },
          {
            path: 'file-download/:uuid',
            component: NoteFileDownloadComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '../core/guards/pending-request.guard';
import { DeleteComponent } from './delete/delete.component';
import { DeleteResolver } from './delete/delete.resolver';
import { DetailsComponent } from './details/details.component';
import { DetailsResolver } from './details/details.resolver';
import { PermissionsResolver } from './details/permissions.resolver';
import { SignatureFileDownloadComponent } from './file-download/signature-file-download.component';
import { RegulatorsComponent } from './regulators.component';
import { RegulatorsGuard } from './regulators.guard';

const routes: Routes = [
  {
    path: '',
    data: { pageTitle: 'Regulator users' },
    component: RegulatorsComponent,
    resolve: { regulators: RegulatorsGuard },
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'add',
    data: { pageTitle: 'Add a new user', breadcrumb: true },
    component: DetailsComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: ':userId',
    children: [
      {
        path: '',
        data: {
          pageTitle: 'User details',
          breadcrumb: ({ user }) => `${user.firstName} ${user.lastName}`,
        },
        pathMatch: 'full',
        component: DetailsComponent,
        resolve: {
          user: DetailsResolver,
          permissions: PermissionsResolver,
        },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'delete',
        data: {
          pageTitle: 'Confirm that this user account will be deleted',
          breadcrumb: ({ user }) => `Delete ${user.firstName} ${user.lastName}`,
        },
        component: DeleteComponent,
        resolve: { user: DeleteResolver },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: '2fa',
        loadChildren: () => import('../two-fa/two-fa.module').then((m) => m.TwoFaModule),
      },
      {
        path: 'file-download/:uuid',
        component: SignatureFileDownloadComponent,
      },
    ],
  },
  {
    path: 'file-download/:uuid',
    component: SignatureFileDownloadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegulatorRoutingModule {}

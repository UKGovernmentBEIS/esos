import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';

import { InvalidLinkComponent } from './invalid-link/invalid-link.component';
import { InvitationConfirmationComponent } from './invitation-confirmation/invitation-confirmation.component';
import { RegulatorInvitationGuard } from './regulator-invitation/regulator-invitation.guard';
import { VerifierInvitationComponent } from './verifier-invitation/verifier-invitation.component';
import { VerifierInvitationGuard } from './verifier-invitation/verifier-invitation.guard';

const routes: Routes = [
  {
    path: 'regulator',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        title: 'You have successfully activated your user account',
        component: InvitationConfirmationComponent,
        canActivate: [RegulatorInvitationGuard],
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'invalid-link',
        title: 'This link is invalid',
        component: InvalidLinkComponent,
      },
    ],
  },
  {
    path: 'verifier',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        title: 'Activate your account',
        component: VerifierInvitationComponent,
        canActivate: [VerifierInvitationGuard],
        resolve: { invitedUser: VerifierInvitationGuard },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'confirmed',
        title: 'You have successfully activated your user account',
        component: InvitationConfirmationComponent,
      },
      {
        path: 'invalid-link',
        title: 'This link is invalid',
        component: InvalidLinkComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationRouting {}

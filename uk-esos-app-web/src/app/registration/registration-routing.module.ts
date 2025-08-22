import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';

import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { InviteOperatorGuard } from './guards/invite-operator.guard';
import { RegisterUserGuard } from './guards/register-user.guard';
import { InvalidEmailLinkComponent } from './invalid-email-link/invalid-email-link.component';
import { InvalidInvitationLinkComponent } from './invalid-invitation-link/invalid-invitation-link.component';
import { InvitationComponent } from './invitation/invitation.component';
import { SuccessComponent } from './success/success.component';
import { SummaryComponent } from './summary/summary.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

const routes: Routes = [
  {
    path: 'invalid-link',
    component: InvalidEmailLinkComponent,
  },
  {
    path: 'invitation',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        canActivate: [InviteOperatorGuard],
        resolve: { operatorInvitedUserInfoDTO: InviteOperatorGuard },
        title: 'You have been added as a user to this organisation account',
        component: InvitationComponent,
        pathMatch: 'full',
      },
      {
        path: 'invalid-link',
        component: InvalidInvitationLinkComponent,
      },
    ],
  },
  {
    path: 'register',
    component: UserRegistrationComponent,
    canActivate: [RegisterUserGuard],
    children: [
      {
        path: '',
        redirectTo: 'contact-details',
        pathMatch: 'full',
      },
      {
        path: 'contact-details',
        title: 'Enter your details',
        component: ContactDetailsComponent,
      },
      {
        path: 'summary',
        title: 'Check your answers',
        component: SummaryComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'success',
        title: 'You have successfully created a user account',
        component: SuccessComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}

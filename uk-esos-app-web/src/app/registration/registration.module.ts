import { NgModule } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import { SharedModule } from '../shared/shared.module';
import { SharedUserModule } from '../shared-user/shared-user.module';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { InvalidEmailLinkComponent } from './invalid-email-link/invalid-email-link.component';
import { InvalidInvitationLinkComponent } from './invalid-invitation-link/invalid-invitation-link.component';
import { InvitationComponent } from './invitation/invitation.component';
import { RegistrationRoutingModule } from './registration-routing.module';
import { SuccessComponent } from './success/success.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

@NgModule({
  declarations: [
    ContactDetailsComponent,
    InvalidEmailLinkComponent,
    InvalidInvitationLinkComponent,
    InvitationComponent,
    SuccessComponent,
    UserRegistrationComponent,
  ],
  imports: [PageHeadingComponent, RegistrationRoutingModule, SharedModule, SharedUserModule, SummaryHeaderComponent],
})
export class RegistrationModule {}

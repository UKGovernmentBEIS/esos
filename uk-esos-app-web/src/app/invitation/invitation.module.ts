import { NgModule } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';

import { SharedUserModule } from '../shared-user/shared-user.module';
import { InvalidLinkComponent } from './invalid-link/invalid-link.component';
import { InvitationConfirmationComponent } from './invitation-confirmation/invitation-confirmation.component';
import { InvitationRouting } from './invitation-routing.module';
import { VerifierInvitationComponent } from './verifier-invitation/verifier-invitation.component';

@NgModule({
  declarations: [InvalidLinkComponent, InvitationConfirmationComponent, VerifierInvitationComponent],
  imports: [InvitationRouting, PageHeadingComponent, PendingButtonDirective, SharedModule, SharedUserModule],
})
export class InvitationModule {}

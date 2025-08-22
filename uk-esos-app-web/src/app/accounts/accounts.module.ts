import { NgModule } from '@angular/core';

import { AccountRelatedActionsComponent } from '@accounts/shared/account-related-actions/account-related-actions.component';
import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { NoteFileDownloadComponent } from '@shared/components/note-file-download/note-file-download.component';
import { RelatedActionsComponent } from '@shared/components/related-actions/related-actions.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { AccountStatusTagColorPipe } from '@shared/pipes/account-status-tag-color.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { SharedModule } from '@shared/shared.module';

import { SharedUserModule } from '../shared-user/shared-user.module';
import {
  AccountComponent,
  AccountDetailsComponent,
  AccountNoteComponent,
  AccountNotesComponent,
  AccountsListComponent,
  AccountsPageComponent,
  AddComponent,
  AppointComponent,
  ConfirmationComponent as VerBodyConfirmationComponent,
  DeleteAccountNoteComponent,
  DeleteComponent,
  DetailsComponent as OperatorDetailsComponent,
  OperatorsComponent,
  PhasesComponent,
  ProcessActionsComponent,
  WorkflowsComponent,
} from '.';
import { AccountsRoutingModule } from './accounts-routing.module';

@NgModule({
  declarations: [
    AccountComponent,
    AccountNoteComponent,
    AccountsListComponent,
    AccountsPageComponent,
    AddComponent,
    AppointComponent,
    DeleteAccountNoteComponent,
    DeleteComponent,
    NoteFileDownloadComponent,
    OperatorDetailsComponent,
    OperatorsComponent,
    VerBodyConfirmationComponent,
    WorkflowsComponent,
  ],
  imports: [
    AccountDetailsComponent,
    AccountNotesComponent,
    AccountRelatedActionsComponent,
    AccountsRoutingModule,
    AccountStatusTagColorPipe,
    GovukDatePipe,
    PageHeadingComponent,
    PendingButtonDirective,
    PhasesComponent,
    ProcessActionsComponent,
    RelatedActionsComponent,
    SharedModule,
    SharedUserModule,
    StatusTagColorPipe,
  ],
  providers: [ItemLinkPipe],
})
export class AccountsModule {}

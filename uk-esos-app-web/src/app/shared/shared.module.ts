/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color/status-tag-color.pipe';
import { BackLinkComponent } from '@core/navigation/backlink';
import { BreadcrumbsComponent } from '@core/navigation/breadcrumbs/breadcrumbs.component';
import { PaymentNotCompletedComponent } from '@shared/components/payment-not-completed/payment-not-completed.component';
import { SelectOtherComponent } from '@shared/components/select-other/select-other.component';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { CountiesDirective } from '@shared/directives/counties.directive';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { DaysRemainingPipe } from '@shared/pipes/days-remaining.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { ItemNamePipe } from '@shared/pipes/item-name.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';

import { GovukComponentsModule } from 'govuk-components';

import { AddAnotherDirective } from './add-another/add-another.directive';
import { AddressInputComponent } from './address-input/address-input.component';
import { BaseSuccessComponent } from './base-success/base-success.component';
import { NotifyOperatorComponent } from './components/notify-operator/notify-operator.component';
import { RequestActionHeadingComponent } from './components/request-action-heading/request-action-heading.component';
import { SummaryDownloadFilesComponent } from './components/summary-download-files/summary-download-files.component';
import { DashboardPageComponent, DashboardStore, ItemTypePipe, WorkflowItemsListComponent } from './dashboard';
import { AsyncValidationFieldDirective } from './directives/async-validation-field.directive';
import { CountriesDirective } from './directives/countries.directive';
import { UsersTableDirective } from './directives/users-table.directive';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FileInputComponent } from './file-input/file-input.component';
import { FileUploadListComponent } from './file-upload-list/file-upload-list.component';
import { GroupedSummaryListDirective } from './grouped-summary-list/grouped-summary-list.directive';
import { HighlightDiffComponent } from './highlight-diff/highlight-diff.component';
import { MultipleFileInputComponent } from './multiple-file-input/multiple-file-input.component';
import { PendingButtonDirective } from './pending-button.directive';
import { PhaseBarComponent } from './phase-bar/phase-bar.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { ItemLinkPipe } from './pipes/item-link.pipe';
import { NegativeNumberPipe } from './pipes/negative-number.pipe';
import { TextEllipsisPipe } from './pipes/text-ellipsis.pipe';
import { RadioOptionComponent } from './radio-option/radio-option.component';
import { ResponsibilityTypesComponent } from './responsibility-types/responsibility-types.component';
import { SkipLinkFocusDirective } from './skip-link-focus.directive';
import { TwoFaLinkComponent } from './two-fa-link/two-fa-link.component';
import { UserInputComponent } from './user-input/user-input.component';
import { UserLockedComponent } from './user-locked/user-locked.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GovukComponentsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    StatusTagColorPipe,
    PageHeadingComponent,
    DaysRemainingPipe,
    ItemNamePipe,
    ItemLinkPipe,
    GovukDatePipe,
    PendingButtonDirective,
    ResponsibilityTypesComponent,
  ],
  declarations: [
    AddAnotherDirective,
    AddressInputComponent,
    CountyAddressInputComponent,
    AsyncValidationFieldDirective,
    BackLinkComponent,
    BaseSuccessComponent,
    BreadcrumbsComponent,
    CountriesDirective,
    CountiesDirective,
    DashboardPageComponent,
    ErrorPageComponent,
    FileDownloadComponent,
    FileInputComponent,
    FileUploadListComponent,
    GroupedSummaryListDirective,
    HighlightDiffComponent,
    ItemTypePipe,
    MultipleFileInputComponent,
    NegativeNumberPipe,
    NotifyOperatorComponent,
    PaymentNotCompletedComponent,
    PhaseBarComponent,
    PhoneInputComponent,
    RadioOptionComponent,
    RequestActionHeadingComponent,
    SelectOtherComponent,
    SkipLinkFocusDirective,
    SummaryDownloadFilesComponent,
    TextEllipsisPipe,
    TwoFaLinkComponent,
    UserInputComponent,
    UserLockedComponent,
    UsersTableDirective,
    WorkflowItemsListComponent,
  ],
  exports: [
    AddAnotherDirective,
    AddressInputComponent,
    CountyAddressInputComponent,
    AsyncValidationFieldDirective,
    BackLinkComponent,
    BaseSuccessComponent,
    BreadcrumbsComponent,
    CommonModule,
    CountriesDirective,
    CountiesDirective,
    DashboardPageComponent,
    ErrorPageComponent,
    FileDownloadComponent,
    FileInputComponent,
    FormsModule,
    GovukComponentsModule,
    GroupedSummaryListDirective,
    HighlightDiffComponent,
    ItemTypePipe,
    MultipleFileInputComponent,
    NegativeNumberPipe,
    NotifyOperatorComponent,
    PaymentNotCompletedComponent,
    PhaseBarComponent,
    PhoneInputComponent,
    PipesModule,
    RadioOptionComponent,
    ReactiveFormsModule,
    RequestActionHeadingComponent,
    ResponsibilityTypesComponent,
    SelectOtherComponent,
    SkipLinkFocusDirective,
    SummaryDownloadFilesComponent,
    TextEllipsisPipe,
    TwoFaLinkComponent,
    UserInputComponent,
    UserLockedComponent,
    UsersTableDirective,
    WorkflowItemsListComponent,
  ],
  providers: [DashboardStore, ItemLinkPipe],
})
export class SharedModule {}

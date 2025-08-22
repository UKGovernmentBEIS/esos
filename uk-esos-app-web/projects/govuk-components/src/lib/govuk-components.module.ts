import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionComponent, AccordionItemComponent } from './accordion';
import { BackLinkComponent } from './back-link';
import { BreadcrumbsComponent } from './breadcrumbs';
import { CheckboxComponent, CheckboxesComponent } from './checkboxes';
import { CookiesPopUpComponent } from './cookies-pop-up';
import { DateInputComponent } from './date-input';
import { DetailsComponent } from './details';
import {
  ButtonDirective,
  ConditionalContentDirective,
  DebounceClickDirective,
  FormErrorDirective,
  InsetTextDirective,
  LabelDirective,
  LinkDirective,
} from './directives';
import { ErrorMessageComponent } from './error-message';
import { ErrorSummaryComponent } from './error-summary';
import { FieldsetDirective, FieldsetHintDirective, LegendDirective } from './fieldset';
import { FileUploadComponent } from './file-upload';
import { FooterComponent, FooterNavListComponent, MetaInfoComponent } from './footer';
import { FormBuilderService } from './form/form-builder.service';
import { HeaderActionsListComponent, HeaderComponent, HeaderNavListComponent } from './header';
import { NotificationBannerComponent } from './notification-banner';
import { PaginationBlockComponent, PaginationComponent } from './pagination';
import { PanelComponent } from './panel';
import { PhaseBannerComponent } from './phase-banner';
import { RadioComponent, RadioOptionComponent } from './radio';
import { SelectComponent } from './select';
import { SkipLinkComponent } from './skip-link';
import {
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnKeyDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from './summary-list';
import { TableComponent } from './table';
import { TabDirective, TabLazyDirective, TabsComponent } from './tabs';
import { TagComponent } from './tag';
import { TextInputComponent } from './text-input';
import { TextareaComponent } from './textarea';
import { WarningTextComponent } from './warning-text';

@NgModule({
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    BackLinkComponent,
    BreadcrumbsComponent,
    ButtonDirective,
    CheckboxComponent,
    CheckboxesComponent,
    CommonModule,
    ConditionalContentDirective,
    CookiesPopUpComponent,
    DateInputComponent,
    DebounceClickDirective,
    DetailsComponent,
    ErrorMessageComponent,
    ErrorSummaryComponent,
    FieldsetDirective,
    FieldsetHintDirective,
    FileUploadComponent,
    FooterComponent,
    FooterNavListComponent,
    FormErrorDirective,
    HeaderActionsListComponent,
    HeaderComponent,
    HeaderNavListComponent,
    HttpClientModule,
    InsetTextDirective,
    LabelDirective,
    LegendDirective,
    LinkDirective,
    MetaInfoComponent,
    NotificationBannerComponent,
    PaginationBlockComponent,
    PaginationComponent,
    PanelComponent,
    PhaseBannerComponent,
    RadioComponent,
    RadioOptionComponent,
    ReactiveFormsModule,
    RouterModule,
    SelectComponent,
    SkipLinkComponent,
    SummaryListColumnActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnKeyDirective,
    SummaryListColumnValueDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    TabDirective,
    TabLazyDirective,
    TableComponent,
    TabsComponent,
    TagComponent,
    TextareaComponent,
    TextInputComponent,
    WarningTextComponent,
  ],
  exports: [
    AccordionComponent,
    AccordionItemComponent,
    BackLinkComponent,
    BreadcrumbsComponent,
    ButtonDirective,
    CheckboxComponent,
    CheckboxesComponent,
    ConditionalContentDirective,
    CookiesPopUpComponent,
    DateInputComponent,
    DebounceClickDirective,
    DetailsComponent,
    ErrorMessageComponent,
    ErrorSummaryComponent,
    FieldsetDirective,
    FieldsetHintDirective,
    FileUploadComponent,
    FooterComponent,
    FooterNavListComponent,
    FormErrorDirective,
    HeaderActionsListComponent,
    HeaderComponent,
    HeaderNavListComponent,
    InsetTextDirective,
    LabelDirective,
    LegendDirective,
    LinkDirective,
    MetaInfoComponent,
    NotificationBannerComponent,
    PaginationBlockComponent,
    PaginationComponent,
    PanelComponent,
    PhaseBannerComponent,
    RadioComponent,
    RadioOptionComponent,
    SelectComponent,
    SkipLinkComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    TabDirective,
    TabLazyDirective,
    TableComponent,
    TabsComponent,
    TagComponent,
    TextareaComponent,
    TextInputComponent,
    WarningTextComponent,
  ],
  providers: [
    { provide: UntypedFormBuilder, useClass: FormBuilderService },
    { provide: FormBuilder, useClass: FormBuilderService },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GovukComponentsModule {}

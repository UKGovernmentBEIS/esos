import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';

import {
  GovukTableColumn,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  TableComponent,
} from 'govuk-components';

import { CertificateDetails } from 'esos-api';

@Component({
  selector: 'esos-certificate-details-list-summary-template',
  standalone: true,
  imports: [
    GovukDatePipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    TableComponent,
    RouterLink,
    NgIf,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './certificate-details-list-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDetailsListSummaryTemplateComponent {
  @Input() certificatesDetails: CertificateDetails[];
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() columns: GovukTableColumn[];
}

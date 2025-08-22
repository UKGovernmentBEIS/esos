import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  ReportingObligationStepUrl,
} from '@tasks/notification/subtasks/reporting-obligation/reporting-obligation.helper';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ReportingObligation } from 'esos-api';

import { reportingObligationContentMap } from './reporting-obligation-summary-page.map';

@Component({
  selector: 'esos-reporting-obligation-summary-page',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    NgSwitch,
    NgTemplateOutlet,
    NgIf,
    NgSwitchCase,
    NgForOf,
    ButtonDirective,
    LinkDirective,
  ],
  templateUrl: './reporting-obligation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSummaryPageComponent {
  @Input() data: ReportingObligation;
  @Input() isEditable = false;

  protected stepUrls = ReportingObligationStepUrl;
  protected roContentMap = REPORTING_OBLIGATION_CONTENT_MAP;
  protected contentMap = reportingObligationContentMap;
}

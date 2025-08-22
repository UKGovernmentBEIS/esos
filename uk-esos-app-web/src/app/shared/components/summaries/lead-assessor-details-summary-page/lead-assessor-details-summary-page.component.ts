import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InternalExternalPipe } from '@shared/pipes/internal-external.pipe';
import { ProfessionalBodyPipe } from '@shared/pipes/professional-body.pipe';

import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { LeadAssessor } from 'esos-api';

@Component({
  selector: 'esos-lead-assessor-details-summary-page',
  standalone: true,
  imports: [
    InternalExternalPipe,
    LinkDirective,
    ProfessionalBodyPipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    RouterLink,
    NgIf,
  ],
  templateUrl: './lead-assessor-details-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadAssessorDetailsSummaryPageComponent {
  @Input() leadAssessor: LeadAssessor;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
}

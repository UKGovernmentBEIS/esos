import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
} from 'govuk-components';

@Component({
  selector: 'esos-energy-savings-details-summary-template',
  templateUrl: './energy-savings-details-summary-template.component.html',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    NgIf,
    RouterLink,
    LinkDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsDetailsSummaryTemplateComponent {
  @Input() energySavingsDetails: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() changeLink = '';
}

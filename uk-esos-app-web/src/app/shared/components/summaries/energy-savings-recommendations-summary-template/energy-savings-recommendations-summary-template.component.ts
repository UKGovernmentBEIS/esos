import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';
import { SkipQuestionPipe } from '@shared/pipes/skip-question.pipe';

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

import { EnergySavingsRecommendations } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-recommendations-summary-template',
  templateUrl: './energy-savings-recommendations-summary-template.component.html',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    RouterLink,
    SkipQuestionPipe,
    NoDataEnteredPipe,
    LinkDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsRecommendationsSummaryTemplateComponent {
  @Input() energySavingsRecommendationsExist: string;
  @Input() energySavingsRecommendations: EnergySavingsRecommendations;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() changeLinkExist = '';
  @Input() changeLink = '';
}

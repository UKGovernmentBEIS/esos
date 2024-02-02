import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ResponsibleUndertaking } from 'esos-api';

@Component({
  selector: 'esos-responsible-undertaking-summary-page',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NgIf,
    BooleanToTextPipe,
  ],
  templateUrl: './responsible-undertaking-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsibleUndertakingSummaryPageComponent {
  @Input() responsibleUndertaking: ResponsibleUndertaking;
  @Input() responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking>;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable: boolean;
}

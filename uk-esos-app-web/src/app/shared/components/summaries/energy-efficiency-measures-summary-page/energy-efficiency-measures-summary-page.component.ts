import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { EnergyEfficiencyMeasuresStepUrl } from '@tasks/action-plan/subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import { PROPOSED_MEASURES_CONTENT } from '@tasks/action-plan/subtasks/energy-efficiency-measures/proposed-measures/proposed-measures-content';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ActionPlanEnergyEfficiencyMeasure } from 'esos-api';

import { EnergyEfficiencyMeasureSummaryListTemplateComponent } from '../energy-efficiency-measure-summary-list-template/energy-efficiency-measure-summary-list-template.component';

@Component({
  selector: 'esos-energy-efficiency-measures-summary-page',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    LinkDirective,
    BooleanToTextPipe,
    EnergyEfficiencyMeasureSummaryListTemplateComponent,
  ],
  templateUrl: './energy-efficiency-measures-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyEfficiencyMeasuresSummaryPageComponent {
  @Input() data: ActionPlanEnergyEfficiencyMeasure;
  @Input() isEditable = false;

  readonly stepUrls = EnergyEfficiencyMeasuresStepUrl;
  readonly proposedMeasureContentMap = PROPOSED_MEASURES_CONTENT;
}

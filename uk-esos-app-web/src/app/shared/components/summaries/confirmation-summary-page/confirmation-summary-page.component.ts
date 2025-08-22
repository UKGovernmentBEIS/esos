import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EnergyAssessmentTypesPipe } from '@shared/pipes/energy-assessment-types.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';

import {
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnKeyDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { Confirmations } from 'esos-api';

@Component({
  selector: 'esos-confirmation-summary-page',
  standalone: true,
  imports: [
    GovukDatePipe,
    LinkDirective,
    PipesModule,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnKeyDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    RouterLink,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: './confirmation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationSummaryPageComponent implements OnInit {
  @Input() confirmation: Confirmations;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;

  responsibilityAssessmentTypes: { [key: string]: string };
  noEnergyResponsibilityAssessmentTypes: { [key: string]: string };
  secondResponsibleOfficerEnergyTypes: { [key: string]: string };

  ngOnInit(): void {
    const energyAssessmentTypesPipe = new EnergyAssessmentTypesPipe();

    this.responsibilityAssessmentTypes = (this.confirmation.responsibilityAssessmentTypes || [])
      .map((type) => ({
        [type]: energyAssessmentTypesPipe.transform(type),
      }))
      .reduce((prev, cur) => ({ ...prev, ...cur }), {});

    this.noEnergyResponsibilityAssessmentTypes = (this.confirmation.noEnergyResponsibilityAssessmentTypes || [])
      .map((type) => ({
        [type]: energyAssessmentTypesPipe.transform(type, true),
      }))
      .reduce((prev, cur) => ({ ...prev, ...cur }), {});

    this.secondResponsibleOfficerEnergyTypes = (this.confirmation.secondResponsibleOfficerEnergyTypes || [])
      .map((type) => ({
        [type]: energyAssessmentTypesPipe.transform(type),
      }))
      .reduce((prev, cur) => ({ ...prev, ...cur }), {});
  }
}

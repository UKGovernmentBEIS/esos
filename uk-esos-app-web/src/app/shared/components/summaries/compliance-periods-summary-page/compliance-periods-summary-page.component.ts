import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { EnergyConsumptionDetailsSummaryTemplateComponent, WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';
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

import { SecondCompliancePeriod } from 'esos-api';

@Component({
  selector: 'esos-compliance-periods-summary-page',
  standalone: true,
  imports: [
    NgIf,
    PipesModule,
    RouterLink,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    BooleanToTextPipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    SkipQuestionPipe,
  ],
  templateUrl: './compliance-periods-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompliancePeriodsSummaryPageComponent implements OnInit {
  @Input() compliancePeriod: SecondCompliancePeriod;
  @Input() isEditable = false;
  @Input() isFirstCompliancePeriod: boolean;
  @Input() wizardStep: { [s: string]: string };
  changeQueryParams: Params = { change: true };

  //headings
  informationExistsHeading: string;
  organisationalEnergyConsumption: string;
  organisationalEnergyConsumptionBreakdownHeading: string;
  significantEnergyConsumptionHeading: string;
  explanationOfChangesToTotalConsumptionHeading: string;
  potentialReductionHeading: string;
  reductionAchievedHeading: string;

  constructor(readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.informationExistsHeading = WIZARD_STEP_HEADINGS[this.wizardStep.INFORMATION_EXISTS](
      this.isFirstCompliancePeriod,
    );
    this.organisationalEnergyConsumption = WIZARD_STEP_HEADINGS[this.wizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION](
      this.isFirstCompliancePeriod,
    );

    this.organisationalEnergyConsumptionBreakdownHeading = WIZARD_STEP_HEADINGS[
      this.wizardStep.ORGANISATIONAL_ENERGY_CONSUMPTION_BREAKDOWN
    ](this.isFirstCompliancePeriod);

    this.significantEnergyConsumptionHeading = WIZARD_STEP_HEADINGS[this.wizardStep.SIGNIFICANT_ENERGY_CONSUMPTION](
      this.isFirstCompliancePeriod,
    );

    this.explanationOfChangesToTotalConsumptionHeading = WIZARD_STEP_HEADINGS[
      this.wizardStep.EXPLANATION_OF_CHANGES_TO_TOTAL_CONSUMPTION
    ](this.isFirstCompliancePeriod);

    this.potentialReductionHeading = WIZARD_STEP_HEADINGS[this.wizardStep.POTENTIAL_REDUCTION](
      this.isFirstCompliancePeriod,
    );

    this.reductionAchievedHeading = WIZARD_STEP_HEADINGS[this.wizardStep.REDUCTION_ACHIEVED](
      this.isFirstCompliancePeriod,
    );
  }
}

import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { MEASURE_FORM_CONTENT } from '@tasks/action-plan/subtasks/energy-efficiency-measures/measure/measure-content';
import { utils, writeFileXLSX } from 'xlsx';

import { EnergyEfficiencyMeasure } from 'esos-api';

import { ActionPlanPublishedDataResult } from './action-plan-published-data.interfaces';
import {
  actionPlansTabHeaderMap,
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './action-plan-published-data.maps';

const ACTION_PLANS_LABEL = 'Action Plans';
const MEASURES_LABEL = 'Energy Efficiency Measures';
const CONFIRMATION_LABEL = 'Resp. officer confirmation';

@Injectable({ providedIn: 'root' })
export class ActionPlanPublishedDataService {
  private readonly booleanToTextPipe = new BooleanToTextPipe();
  private readonly govukDatePipe = new GovukDatePipe();
  private readonly measureSchemePipe = new MeasureSchemePipe();
  private readonly datePipe = new DatePipe('en-GB');
  private readonly estimationMethodTypePipe = new EstimationMethodTypePipe();
  private readonly capitalizeFirstPipe = new CapitalizeFirstPipe();

  exportToExcel(result: ActionPlanPublishedDataResult) {
    const wb = utils.book_new();

    utils.book_append_sheet(wb, utils.json_to_sheet(this._createTableOfContentsTabData()), 'Table of Contents');
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createActionPlansTabData(result)), ACTION_PLANS_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createMeasuresTabData(result)), MEASURES_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createConfirmationTabData(result)), CONFIRMATION_LABEL);

    writeFileXLSX(wb, 'Action_Plan_Published_Data_Phase_3.xlsx');
  }

  private _createTableOfContentsTabData(): { [key: string]: string }[] {
    const { sheet, description } = tableOfContentTabHeaderMap;
    return [
      {
        [sheet]: ACTION_PLANS_LABEL,
        [description]: '',
      },
      {
        [sheet]: MEASURES_LABEL,
        [description]: '',
      },
      {
        [sheet]: CONFIRMATION_LABEL,
        [description]: '',
      },
    ];
  }

  private _createActionPlansTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    const map = actionPlansTabHeaderMap;
    return result.actionPlanSearchResultsInfos.map((item) => ({
      [map.apId]: item.actionPlanId,
      [map.organisationName]: item.organisationName,
      [map.companyRegistrationNumber]: item.registrationNumber,
      [map.apSubmissionDate]: this.govukDatePipe.transform(item.actionPlanSubmitDate),
      [map.nocId]: item.nocId,
      [map.nocSubmissionDate]: this.govukDatePipe.transform(item.nocSubmitDate),
      [map.haveEnergyEfficiencyMeasures]: this.booleanToTextPipe.transform(
        item.actionPlanContainer.actionPlan?.energyEfficiencyMeasure?.haveEnergyEfficiencyMeasures,
      ),
      [map.noMeasureContext]: item.actionPlanContainer.actionPlan?.energyEfficiencyMeasure?.noMeasureContext,
    }));
  }

  private _createMeasuresTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    const map = measuresTabHeaderMap;
    return result.actionPlanSearchResultsInfos
      .reduce(
        (acc, item) => {
          const measures = item.actionPlanContainer.actionPlan.energyEfficiencyMeasure.energyEfficiencyMeasures.map(
            (measure) => ({ actionPlanId: item.actionPlanId, measure }),
          );
          return [...acc, ...measures];
        },
        [] as {
          actionPlanId: string;
          measure: EnergyEfficiencyMeasure;
        }[],
      )
      .map(({ actionPlanId, measure }) => ({
        [map.apId]: actionPlanId,
        [map.measureName]: measure.measureName,
        [map.isEnergySavingsOpportunityReportedInAudit]: this.booleanToTextPipe.transform(
          measure.isEnergySavingsOpportunityReportedInAudit,
        ),
        [map.measureScheme]: MEASURE_FORM_CONTENT.measureScheme.options
          .filter((scheme) => measure.measureScheme?.includes(scheme))
          .map(
            (scheme) =>
              this.measureSchemePipe.transform(scheme) +
              (scheme === 'OTHER' ? `: ${measure.otherMeasureSchemeName}` : ''),
          )
          .join('; '),
        [map.implementationDateForMeasure]: this.datePipe.transform(measure.implementationDateForMeasure, 'MM-y'),
        [map.savingsEstimateBuildings]: `${measure.totalEnergySavingsExpected.buildings}`,
        [map.savingsEstimateTransport]: `${measure.totalEnergySavingsExpected.transport}`,
        [map.savingsEstimateIndustrial]: `${measure.totalEnergySavingsExpected.industrialProcesses}`,
        [map.savingsEstimateOther]: `${measure.totalEnergySavingsExpected.otherProcesses}`,
        [map.savingsEstimateTotal]: `${measure.totalEnergySavingsExpected.total}`,
        [map.energySavingsEstimateCalculatedType]: this.capitalizeFirstPipe.transform(
          this.estimationMethodTypePipe.transform(measure.energySavingsEstimateCalculatedType),
        ),
        [map.estimationMethodDescription]: measure.estimationMethodDescription,
        [map.measureContext]: measure.measureContext,
      }));
  }

  private _createConfirmationTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    const map = confirmationTabHeaderMap;
    return result.actionPlanSearchResultsInfos.map((item) => ({
      [map.apId]: item.actionPlanId,
      [map.esosAssessment]: this.booleanToTextPipe.transform(
        item.actionPlanContainer.actionPlan?.responsibleOfficerConfirmation.includes('ESOS_ASSESSMENT_NOTIFICATION'),
      ),
      [map.estimationMethod]: item.actionPlanContainer.actionPlan?.responsibleOfficerConfirmation.includes(
        'ESTIMATION_METHOD_DESCRIPTION',
      )
        ? this.booleanToTextPipe.transform(true)
        : '',
    }));
  }
}

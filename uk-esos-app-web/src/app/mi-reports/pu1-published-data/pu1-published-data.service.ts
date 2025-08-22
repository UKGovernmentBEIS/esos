import { Injectable } from '@angular/core';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { NEW_MEASURE_FORM_CONTENT } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/new-measure/new-measure-content';
import { utils, writeFileXLSX } from 'xlsx';

import { ProgressUpdate1P3AddedMeasure, ProgressUpdate1P3UpdatedMeasure } from 'esos-api';

import { ProgressUpdate1PublishedDataResult } from './pu1-published-data.interfaces';
import {
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  progressUpdatesTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './pu1-published-data.maps';

const UPDATES_LABEL = 'Progress Updates';
const MEASURES_LABEL = 'UpdatesEnergyEfficiencyMeasures';
const CONFIRMATION_LABEL = 'Resp. officer confirmation';

@Injectable({ providedIn: 'root' })
export class ProgressUpdate1PublishedDataService {
  private readonly booleanToTextPipe = new BooleanToTextPipe();
  private readonly govukDatePipe = new GovukDatePipe();
  private readonly measureSchemePipe = new MeasureSchemePipe();
  private readonly estimationMethodTypePipe = new EstimationMethodTypePipe();
  private readonly capitalizeFirstPipe = new CapitalizeFirstPipe();

  exportToExcel(result: ProgressUpdate1PublishedDataResult) {
    const wb = utils.book_new();

    utils.book_append_sheet(wb, utils.json_to_sheet(this._createTableOfContentsTabData()), 'Table of Contents');
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createProgressUpdatesTabData(result)), UPDATES_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createMeasuresTabData(result)), MEASURES_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createConfirmationTabData(result)), CONFIRMATION_LABEL);

    writeFileXLSX(wb, 'PU1_Report_Public_Data_Phase_3.xlsx');
  }

  private _createTableOfContentsTabData(): { [key: string]: string }[] {
    const { sheet, description } = tableOfContentTabHeaderMap;
    return [
      {
        [sheet]: UPDATES_LABEL,
        [description]: '',
      },
      {
        [sheet]: MEASURES_LABEL,
        [description]: 'Update for Energy Efficiency Measures',
      },
      {
        [sheet]: CONFIRMATION_LABEL,
        [description]: 'Responsible officer confirmation',
      },
    ];
  }

  private _createProgressUpdatesTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    const map = progressUpdatesTabHeaderMap;
    return result.progressUpdate1SearchResultsInfos.map((item) => ({
      [map.pu1Id]: item.pu1Id,
      [map.organisationName]: item.organisationName,
      [map.companyRegistrationNumber]: item.registrationNumber ?? '',
      [map.pu1SubmissionDate]: this.govukDatePipe.transform(item.pu1SubmitDate),
      [map.apId]: item.actionPlanId ?? '',
      [map.apSubmissionDate]: this.govukDatePipe.transform(item.actionPlanSubmitDate),
      [map.otherResponsibleUndertakingName]:
        item.progressUpdate1Container?.progressUpdate1P3?.groupChange?.otherResponsibleUndertakingName ?? '',
      [map.otherResponsibleUndertakingCrn]:
        item.progressUpdate1Container?.progressUpdate1P3?.groupChange?.otherResponsibleUndertakingCrn ?? '',
    }));
  }

  private _createMeasuresTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    const map = measuresTabHeaderMap;
    return result.progressUpdate1SearchResultsInfos
      .reduce<
        {
          pu1Id: string;
          updatedMeasure?: ProgressUpdate1P3UpdatedMeasure;
          addedMeasure?: ProgressUpdate1P3AddedMeasure;
        }[]
      >((acc, item) => {
        const updatedMeasures =
          item.progressUpdate1Container.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures.map(
            (updatedMeasure) => ({ pu1Id: item.pu1Id, updatedMeasure }),
          );
        const addedMeasures =
          item.progressUpdate1Container.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure.map(
            (addedMeasure) => ({ pu1Id: item.pu1Id, addedMeasure }),
          );
        return [...acc, ...updatedMeasures, ...addedMeasures];
      }, [])
      .map(({ pu1Id, updatedMeasure, addedMeasure }) => ({
        [map.pu1Id]: pu1Id,
        [map.measureName]: addedMeasure?.measureName ?? updatedMeasure?.actionPlanEnergyEfficiencyMeasure?.measureName,
        [map.isPu1AddedMeasure]: this.booleanToTextPipe.transform(!!addedMeasure),
        [map.totalEnergySavings]: `${updatedMeasure?.actionPlanEnergyEfficiencyMeasure?.totalEnergySavingsExpected?.total ?? ''}`,
        [map.measureScheme]: addedMeasure
          ? NEW_MEASURE_FORM_CONTENT.measureScheme.options
              .filter((scheme) => addedMeasure.measureScheme?.includes(scheme))
              .map(
                (scheme) =>
                  this.measureSchemePipe.transform(scheme) +
                  (scheme === 'OTHER' ? `: ${addedMeasure.otherMeasureSchemeName}` : ''),
              )
              .join('; ')
          : '',
        [map.measureIsImplemented]:
          this.booleanToTextPipe.transform(
            updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure.measureIsImplemented,
          ) ?? '',
        [map.measureImplementedByTheDateInActionPlan]: updatedMeasure
          ? this.booleanToTextPipe.transform(
              updatedMeasure.measureImplType === 'MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN'
                ? true
                : updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure.measureImplementedByTheDateInActionPlan,
            )
          : '',
        [map.reportReduction2024To2025]: this.booleanToTextPipe.transform(
          updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2024To2025,
        ),
        [map.reductionEnergyConsumption2024To2025]: `${
          addedMeasure?.reductionEnergyConsumption2024To2025 ??
          updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2024To2025 ??
          ''
        }`,
        [map.reportReduction2023To2024]: this.booleanToTextPipe.transform(
          updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.reportReduction2023To2024,
        ),
        [map.reductionEnergyConsumption2023To2024]: `${
          addedMeasure?.reductionEnergyConsumption2023To2024 ??
          updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2023To2024 ??
          ''
        }`,
        [map.estimationMethodType]: this.capitalizeFirstPipe.transform(
          this.estimationMethodTypePipe.transform(
            addedMeasure?.estimationMethodType ??
              updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.estimationMethodType ??
              '',
            'summary',
          ),
        ),
        [map.estimationMethodDescription]:
          addedMeasure?.estimationMethodDescription ??
          updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.estimationMethodDescription ??
          '',
        [map.measureContext]: addedMeasure
          ? addedMeasure.measureContext
          : updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.providedContext,
      }));
  }

  private _createConfirmationTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    const map = confirmationTabHeaderMap;
    return result.progressUpdate1SearchResultsInfos.map((item) => ({
      [map.pu1Id]: item.pu1Id,
      [map.esosAssessment]: this.booleanToTextPipe.transform(
        item.progressUpdate1Container.progressUpdate1P3?.responsibleOfficerConfirmation.includes(
          'ESOS_ACTION_PLAN_COMPLIANCE',
        ),
      ),
      [map.estimationMethod]: item.progressUpdate1Container.progressUpdate1P3?.responsibleOfficerConfirmation.includes(
        'ESTIMATION_METHOD_DOCUMENTED',
      )
        ? this.booleanToTextPipe.transform(true)
        : '',
    }));
  }
}

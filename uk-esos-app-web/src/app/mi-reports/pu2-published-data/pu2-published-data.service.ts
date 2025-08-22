import { Injectable } from '@angular/core';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { MeasureSchemePipe } from '@shared/pipes/measure-scheme.pipe';
import { NEW_MEASURE_FORM_CONTENT } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/new-measure/new-measure-content';
import { utils, writeFileXLSX } from 'xlsx';

import {
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import { ProgressUpdate2PublishedDataResult } from './pu2-published-data.interfaces';
import {
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  progressUpdatesTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './pu2-published-data.maps';

const UPDATES_LABEL = 'Progress Updates';
const MEASURES_LABEL = 'UpdatesEnergyEfficiencyMeasures';
const CONFIRMATION_LABEL = 'Resp. officer confirmation';

@Injectable({ providedIn: 'root' })
export class ProgressUpdate2PublishedDataService {
  private readonly booleanToTextPipe = new BooleanToTextPipe();
  private readonly govukDatePipe = new GovukDatePipe();
  private readonly measureSchemePipe = new MeasureSchemePipe();
  private readonly estimationMethodTypePipe = new EstimationMethodTypePipe();
  private readonly capitalizeFirstPipe = new CapitalizeFirstPipe();

  exportToExcel(result: ProgressUpdate2PublishedDataResult) {
    const wb = utils.book_new();

    utils.book_append_sheet(wb, utils.json_to_sheet(this._createTableOfContentsTabData()), 'Table of Contents');
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createProgressUpdatesTabData(result)), UPDATES_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createMeasuresTabData(result)), MEASURES_LABEL);
    utils.book_append_sheet(wb, utils.json_to_sheet(this._createConfirmationTabData(result)), CONFIRMATION_LABEL);

    writeFileXLSX(wb, 'PU2_Report_Public_Data_Phase_3.xlsx');
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

  private _createProgressUpdatesTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    const map = progressUpdatesTabHeaderMap;
    return result.progressUpdate2SearchResultsInfos.map((item) => ({
      [map.pu2Id]: item.pu2Id,
      [map.pu2SubmissionDate]: this.govukDatePipe.transform(item.pu2SubmitDate),
      [map.organisationName]: item.organisationName,
      [map.companyRegistrationNumber]: item.registrationNumber ?? '',
      [map.apId]: item.actionPlanId ?? '',
      [map.apSubmissionDate]: this.govukDatePipe.transform(item.actionPlanSubmitDate),
      [map.pu1Id]: item.pu1Id ?? '',
      [map.pu1SubmissionDate]: this.govukDatePipe.transform(item.pu1SubmitDate),
      [map.otherResponsibleUndertakingName]:
        item.progressUpdate2Container?.progressUpdate2P3?.groupChange?.otherResponsibleUndertakingName ?? '',
      [map.otherResponsibleUndertakingCrn]:
        item.progressUpdate2Container?.progressUpdate2P3?.groupChange?.otherResponsibleUndertakingCrn ?? '',
    }));
  }

  private _createMeasuresTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    const map = measuresTabHeaderMap;
    return result.progressUpdate2SearchResultsInfos
      .reduce<
        {
          pu2Id: string;
          updatedMeasure?: ProgressUpdate2P3UpdatedMeasure;
          updatedPu1AddedMeasure?: ProgressUpdate2P3UpdatedAddedMeasure;
          addedMeasure?: ProgressUpdate2P3AddedMeasure;
        }[]
      >((acc, item) => {
        const updatedMeasures =
          item.progressUpdate2Container.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3Measures.map(
            (updatedMeasure) => ({ pu2Id: item.pu2Id, updatedMeasure }),
          );
        const updatedPu1AddedMeasures =
          item.progressUpdate2Container.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3UpdatedAddedMeasures.map(
            (updatedPu1AddedMeasure) => ({ pu2Id: item.pu2Id, updatedPu1AddedMeasure }),
          );
        const addedMeasures =
          item.progressUpdate2Container.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure.map(
            (addedMeasure) => ({ pu2Id: item.pu2Id, addedMeasure }),
          );
        return [...acc, ...updatedMeasures, ...updatedPu1AddedMeasures, ...addedMeasures];
      }, [])
      .map(({ pu2Id, updatedMeasure, updatedPu1AddedMeasure, addedMeasure }) => ({
        [map.pu2Id]: pu2Id,
        [map.measureName]:
          addedMeasure?.measureName ??
          updatedPu1AddedMeasure?.progressUpdate1P3AddedMeasure?.measureName ??
          updatedMeasure?.actionPlanEnergyEfficiencyMeasure?.measureName,
        [map.isPu2AddedMeasure]: this.booleanToTextPipe.transform(!!addedMeasure),
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
            updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.measureIsImplemented,
          ) ?? '',
        [map.measureImplementedByTheDateInActionPlan]: updatedMeasure
          ? this.booleanToTextPipe.transform(
              (updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure.measureImplementedByTheDateInActionPlan ??
                updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.measureImplementedByTheDateInActionPlan) ||
                updatedMeasure?.progressUpdate1P3EnergyEfficiencyMeasure?.measureIsImplemented === undefined,
            )
          : '',
        [map.reportReduction2025To2026]: this.booleanToTextPipe.transform(
          updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.reportReduction2025To2026 ??
            updatedPu1AddedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.reportReduction2025To2026,
        ),
        [map.reductionEnergyConsumption2025To2026]: `${
          addedMeasure?.reductionEnergyConsumption2025To2026 ??
          updatedPu1AddedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2025To2026 ??
          updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.reductionEnergyConsumption2025To2026 ??
          ''
        }`,
        [map.estimationMethodType]: this.capitalizeFirstPipe.transform(
          this.estimationMethodTypePipe.transform(
            addedMeasure?.estimationMethodType ??
              updatedPu1AddedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType ??
              updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType ??
              '',
            'summary',
          ),
        ),
        [map.estimationMethodDescription]:
          addedMeasure?.estimationMethodDescription ??
          updatedPu1AddedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodDescription ??
          updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodDescription ??
          '',
        [map.measureContext]:
          addedMeasure?.measureContext ??
          updatedPu1AddedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.providedContext ??
          updatedMeasure?.progressUpdate2P3EnergyEfficiencyMeasure?.providedContext,
      }));
  }

  private _createConfirmationTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    const map = confirmationTabHeaderMap;
    return result.progressUpdate2SearchResultsInfos.map((item) => ({
      [map.pu2Id]: item.pu2Id,
      [map.esosAssessment]: this.booleanToTextPipe.transform(
        item.progressUpdate2Container.progressUpdate2P3?.responsibleOfficerConfirmation.includes(
          'ESOS_ACTION_PLAN_COMPLIANCE',
        ),
      ),
      [map.estimationMethod]: item.progressUpdate2Container.progressUpdate2P3?.responsibleOfficerConfirmation.includes(
        'ESTIMATION_METHOD_DOCUMENTED',
      )
        ? this.booleanToTextPipe.transform(true)
        : '',
    }));
  }
}

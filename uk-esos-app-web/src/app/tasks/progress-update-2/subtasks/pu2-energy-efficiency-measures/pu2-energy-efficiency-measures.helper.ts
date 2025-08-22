import { GovukValidators, MessageValidatorFn } from 'govuk-components';

import { ProgressUpdate2P3UpdatedAddedMeasure, ProgressUpdate2P3UpdatedMeasure } from 'esos-api';

export enum ProgressUpdate2EnergyEfficiencyMeasuresStep {
  UPDATE_FOR_MEASURE = 'updateForMeasure',
  EDIT_UPDATE_FOR_MEASURE = 'editUpdateForMeasure',
  ADD_NEW_MEASURE = 'addNewMeasure',
  EDIT_NEW_MEASURE = 'editNewMeasure',
  REMOVE_NEW_MEASURE = 'removeNewMeasure',
  SUMMARY = 'summary',
}

export enum ProgressUpdate2EnergyEfficiencyMeasuresStepUrl {
  UPDATE_FOR_MEASURE = 'update-for-measure',
  EDIT_UPDATE_FOR_MEASURE = 'edit-update-for-measure',
  ADD_NEW_MEASURE = 'add-new-measure',
  EDIT_NEW_MEASURE = 'edit-new-measure',
  REMOVE_NEW_MEASURE = 'remove-new-measure',
  SUMMARY = '../',
}

export const PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME = 'progressUpdate2P3MeasuresUpdate';

export const PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE = 'Update for energy efficiency measures';

export const PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH = 'update-for-energy-efficiency-measures';

export const isWizardCompleted = (
  measures: (ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure)[],
): boolean => {
  return measures.length ? measures.every((measure) => !!measure.progressUpdate2P3EnergyEfficiencyMeasure) : true;
};

export const getNextUpdateForMeasureIndex = (
  measures: (ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure)[],
): number => {
  return measures.findIndex((measure) => !measure.progressUpdate2P3EnergyEfficiencyMeasure);
};

export const getIntegerValidators = (minInteger: 0 | 1, requiredMessage?: string): MessageValidatorFn[] => {
  const validators = requiredMessage ? [GovukValidators.required(requiredMessage)] : [];
  return [
    ...validators,
    GovukValidators.min(
      minInteger,
      minInteger === 0 ? 'Must be integer greater than or equal to 0' : 'Must be integer greater than 0',
    ),
    GovukValidators.integerNumber('Enter a whole number without decimal places (you can use zero)'),
    GovukValidators.maxDigitsValidator(15),
  ];
};

export const isActionPlanMeasure = (
  measure: ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure,
): measure is ProgressUpdate2P3UpdatedMeasure => {
  return 'actionPlanEnergyEfficiencyMeasure' in measure;
};

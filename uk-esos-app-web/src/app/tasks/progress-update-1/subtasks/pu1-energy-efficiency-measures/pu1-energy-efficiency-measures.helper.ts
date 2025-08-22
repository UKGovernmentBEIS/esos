import { GovukValidators, MessageValidatorFn } from 'govuk-components';

import { ProgressUpdate1P3UpdatedMeasure } from 'esos-api';

export enum ProgressUpdate1EnergyEfficiencyMeasuresStep {
  UPDATE_FOR_MEASURE = 'updateForMeasure',
  EDIT_UPDATE_FOR_MEASURE = 'editUpdateForMeasure',
  ADD_NEW_MEASURE = 'addNewMeasure',
  EDIT_NEW_MEASURE = 'editNewMeasure',
  REMOVE_NEW_MEASURE = 'removeNewMeasure',
  SUMMARY = 'summary',
}

export enum ProgressUpdate1EnergyEfficiencyMeasuresStepUrl {
  UPDATE_FOR_MEASURE = 'update-for-measure',
  EDIT_UPDATE_FOR_MEASURE = 'edit-update-for-measure',
  ADD_NEW_MEASURE = 'add-new-measure',
  EDIT_NEW_MEASURE = 'edit-new-measure',
  REMOVE_NEW_MEASURE = 'remove-new-measure',
  SUMMARY = '../',
}

export const PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME = 'progressUpdate1P3MeasuresUpdate';

export const PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE = 'Update for energy efficiency measures';

export const PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH = 'update-for-energy-efficiency-measures';

export const isWizardCompleted = (measures: ProgressUpdate1P3UpdatedMeasure[]): boolean => {
  return measures.length ? measures.every((measure) => !!measure.progressUpdate1P3EnergyEfficiencyMeasure) : true;
};

export const getNextUpdateForMeasureIndex = (measures: ProgressUpdate1P3UpdatedMeasure[]): number => {
  return measures.findIndex((measure) => !measure.progressUpdate1P3EnergyEfficiencyMeasure);
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

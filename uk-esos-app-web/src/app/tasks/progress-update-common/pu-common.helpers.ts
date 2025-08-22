import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';

import { ProgressUpdate1P3, ProgressUpdate2P3 } from 'esos-api';

export const isProgressUpdate1 = (
  payload: ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload,
): payload is ProgressUpdate1TaskPayload => {
  return 'progressUpdate1P3' in payload;
};

export const isProgressUpdate2 = (
  payload: ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload,
): payload is ProgressUpdate2TaskPayload => {
  return 'progressUpdate2P3' in payload;
};

export function hasOtherEstimationMethod(progressUpdate: ProgressUpdate1P3 | ProgressUpdate2P3): boolean {
  if ('progressUpdate1P3MeasuresUpdate' in progressUpdate) {
    const updatesForMeasures = progressUpdate.progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures;
    const addedMeasures = progressUpdate.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure;

    return (
      !!updatesForMeasures?.some(
        (measure) => measure.progressUpdate1P3EnergyEfficiencyMeasure?.estimationMethodType === 'OTHER_METHOD',
      ) || !!addedMeasures?.some((measure) => measure.estimationMethodType === 'OTHER_METHOD')
    );
  } else if ('progressUpdate2P3MeasuresUpdate' in progressUpdate) {
    const updatesForMeasures = progressUpdate.progressUpdate2P3MeasuresUpdate.progressUpdate2P3Measures;
    const updatesForPu1AddedMeasures =
      progressUpdate.progressUpdate2P3MeasuresUpdate.progressUpdate2P3UpdatedAddedMeasures;
    const pu2AddedMeasures = progressUpdate.progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure;

    return (
      !!updatesForMeasures?.some(
        (measure) => measure.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType === 'OTHER_METHOD',
      ) ||
      !!updatesForPu1AddedMeasures?.some(
        (measure) => measure.progressUpdate2P3EnergyEfficiencyMeasure?.estimationMethodType === 'OTHER_METHOD',
      ) ||
      !!pu2AddedMeasures?.some((measure) => measure.estimationMethodType === 'OTHER_METHOD')
    );
  }

  return false;
}

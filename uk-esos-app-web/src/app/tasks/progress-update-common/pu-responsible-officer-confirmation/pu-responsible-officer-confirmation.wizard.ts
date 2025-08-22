import { ProgressUpdate1P3, ProgressUpdate2P3 } from 'esos-api';

import { hasOtherEstimationMethod } from '../pu-common.helpers';

export const isWizardCompleted = (progressUpdate: ProgressUpdate1P3 | ProgressUpdate2P3) => {
  const requiredConfirmations = hasOtherEstimationMethod(progressUpdate) ? 2 : 1;

  return progressUpdate.responsibleOfficerConfirmation?.length === requiredConfirmations;
};

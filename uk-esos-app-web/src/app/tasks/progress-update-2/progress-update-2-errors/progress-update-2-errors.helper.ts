import {
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import {
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures.helper';

export const ProgressUpdate2ErrorUrlMapper = {
  GroupChange: PU_GROUP_CHANGE_SUBTASK_PATH,
  ProgressUpdate2P3MeasuresUpdate: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ResponsibleOfficerConfirmation: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
};

export const ProgressUpdate2ErrorSubtaskNameMapper = {
  GroupChange: PU_GROUP_CHANGE_SUBTASK_TITLE,
  ProgressUpdate2P3MeasuresUpdate: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  ResponsibleOfficerConfirmation: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
};

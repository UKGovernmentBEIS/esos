import {
  PU_GROUP_CHANGE_SUBTASK_PATH,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-group-change';
import {
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import {
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures.helper';

export const ProgressUpdate1ErrorUrlMapper = {
  GroupChange: PU_GROUP_CHANGE_SUBTASK_PATH,
  ProgressUpdate1P3MeasuresUpdate: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ResponsibleOfficerConfirmation: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
};

export const ProgressUpdate1ErrorSubtaskNameMapper = {
  GroupChange: PU_GROUP_CHANGE_SUBTASK_TITLE,
  ProgressUpdate1P3MeasuresUpdate: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  ResponsibleOfficerConfirmation: PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
};

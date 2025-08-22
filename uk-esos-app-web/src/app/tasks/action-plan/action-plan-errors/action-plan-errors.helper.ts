import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
} from '../subtasks/energy-efficiency-measures/energy-efficiency-measures.helper';
import {
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
  RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
} from '../subtasks/responsible-officer-confirmation/responsible-officer-confirmation.helper';

export const ActionPlanErrorUrlMapper = {
  EnergyEfficiencyMeasure: ENERGY_EFFICIENCY_MEASURES_SUBTASK_PATH,
  ResponsibleOfficerConfirmation: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_PATH,
};

export const ActionPlanErrorSubtaskNameMapper = {
  EnergyEfficiencyMeasure: ENERGY_EFFICIENCY_MEASURES_SUBTASK_TITLE,
  ResponsibleOfficerConfirmation: RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE,
};

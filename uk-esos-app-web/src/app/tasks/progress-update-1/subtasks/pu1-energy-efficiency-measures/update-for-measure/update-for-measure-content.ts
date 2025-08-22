const measureIsImplemented = {
  title: 'Has the measure been implemented?',
  subtitle:
    "Only respond 'yes' if the measure was implemented by no later than 5 December 2025. Measures implemented after this date must be considered in Progress Update 2.",
};

const measureImplementedByTheDateInActionPlan = {
  title: 'Was the measure implemented by the date proposed in the action plan?',
};

const reductionEnergyConsumption2024To2025 = {
  title: 'Reduction in energy consumption between 6 December 2024 and 5 December 2025',
  subtitle:
    'State what the reduction in energy consumption is during the period between 6 December 2024 and 5 December 2025 as a result of implementing the measure. The figure can be based on actual data, or an estimate, or a combination of both.',
};

const reductionEnergyConsumption2023To2024 = {
  title: 'Reduction in energy consumption between 6 December 2023 and 5 December 2024',
  subtitle:
    'If you wish, you may provide a figure for any reduction in energy consumption during the period between 6 December 2023 and 5 December 2024 if the measure was implemented between those dates.',
};

const estimationMethodType = {
  title: 'Estimation method',
  subtitle:
    'If you based the reduction in energy consumption during the period 6 December 2024 - 5 December 2025 on an estimate, select the main method used to make it.',
  subtitleForMeasuresImplementedBeforeActionPlanSubmission:
    'An estimation method is only required for the most recent 12-month period in the event that you have provided estimated energy savings covering both 6 December 2024 - 5 December 2025 and 6 December 2023 - 5 December 2024',
  options: ['ENERGY_AUDIT', 'ACTION_PLAN_ESTIMATE', 'OTHER_METHOD', 'NO_METHOD_USED'],
};

const estimationMethodDescription = { title: 'Describe the method' };

const providedContext = { title: 'Provide context (optional)' };

const reportReduction2024To2025 = {
  title:
    'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2024 and 5 December 2025?',
};

const reportReduction2023To2024 = {
  title:
    'Do you want, optionally, to report a reduction in energy consumption between 6 December 2023 and 5 December 2024?',
};

export const UPDATE_FOR_MEASURE_FORM_CONTENT = {
  title: 'Update for energy efficiency measure',
  editTitle: 'Edit the update for energy efficiency measure',
  measureIsImplemented,
  measureImplementedByTheDateInActionPlan,
  reductionEnergyConsumption2024To2025,
  reductionEnergyConsumption2023To2024,
  estimationMethodType,
  estimationMethodDescription,
  providedContext,
  reportReduction2024To2025,
  reportReduction2023To2024,
};

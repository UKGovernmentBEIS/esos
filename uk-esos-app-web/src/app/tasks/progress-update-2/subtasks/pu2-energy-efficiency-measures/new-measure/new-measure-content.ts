import { ProgressUpdate2P3AddedMeasure } from 'esos-api';

const measureName = { title: 'Enter a name for this measure' };

const measureScheme = {
  title:
    'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
  subtitle: 'Your answer will help us to understand the drivers for taking action on energy efficiency.',
  options: [
    'CLIMATE_CHANGE_AGREEMENTS_CCA',
    'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR',
    'UK_EMISSIONS_TRADING_SCHEME_ETS',
    'UN_RACE_TO_ZERO',
    'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI',
    'CARBON_REDUCTION_PLANS',
    'OTHER',
  ] as ProgressUpdate2P3AddedMeasure['measureScheme'],
};

const otherMeasureSchemeName = { title: 'Enter a name' };

const reductionEnergyConsumption2025To2026 = {
  title: 'Reduction in energy consumption between 6 December 2025 and 5 December 2026',
  subtitle:
    'State what the reduction in energy consumption is during the period between 6 December 2025 and 5 December 2026 as a result of implementing the measure. The figure can be based on actual data, or an estimate, or a combination of both.',
};

const estimationMethodType = {
  title: 'Estimation method',
  subtitle:
    'If you based the reduction in energy consumption during the period 6 December 2025 - 5 December 2026 on an estimate, select the main method used to make it.',
  options: ['ENERGY_AUDIT', 'OTHER_METHOD', 'NO_METHOD_USED'],
};

const estimationMethodDescription = { title: 'Describe the method' };

const measureContext = { title: 'Provide context to the measure (optional)' };

export const NEW_MEASURE_FORM_CONTENT = {
  title: 'Add an energy efficiency measure',
  editTitle: 'Edit the energy efficiency measure',
  measureName,
  measureScheme,
  otherMeasureSchemeName,
  reductionEnergyConsumption2025To2026,
  estimationMethodType,
  estimationMethodDescription,
  measureContext,
};

import { EnergyEfficiencyMeasure } from 'esos-api';

const measureName = { title: 'Enter a name for this measure' };

const isEnergySavingsOpportunityReportedInAudit = {
  title: 'Is this measure a result of an energy savings opportunity reported in an energy audit?',
};

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
  ] as EnergyEfficiencyMeasure['measureScheme'],
};

const otherMeasureSchemeName = { title: 'Enter a name' };

const implementationDateForMeasure = {
  title: 'Implementation date for the measure',
  subtitle: 'The deadline cannot be earlier than December 2023 and must not fall after 5 December 2027',
};

const totalEnergySavingsExpected = {
  title: 'Estimate the total energy savings expected from this measure by organisational purpose',
  subtitle:
    'Provide estimates of savings you reasonably expect to achieve during the period between 6 December 2023 and 5 December 2027.',
};

const energySavingsEstimateCalculatedType = {
  title: 'How was the total energy savings estimate calculated?',
  subtitle: 'Select the main method used',
  options: ['ENERGY_AUDIT', 'ALTERNATIVE_COMPLIANCE_METHOD', 'OTHER_REASONABLE_ESTIMATION_METHOD'],
};

const estimationMethodDescription = { title: 'Describe the method' };

const measureContext = { title: 'Provide context to the measure (optional)' };

export const MEASURE_FORM_CONTENT = {
  title: 'Add an energy efficiency measure',
  editTitle: 'Edit the energy efficiency measure',
  measureName,
  isEnergySavingsOpportunityReportedInAudit,
  measureScheme,
  otherMeasureSchemeName,
  implementationDateForMeasure,
  totalEnergySavingsExpected,
  energySavingsEstimateCalculatedType,
  estimationMethodDescription,
  measureContext,
};

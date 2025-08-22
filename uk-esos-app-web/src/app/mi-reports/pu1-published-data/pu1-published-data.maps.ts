import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { ProgressUpdateReviewPipe } from '@shared/pipes/pu-review.pipe';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from '@tasks/progress-update-1/subtasks/pu1-energy-efficiency-measures/update-for-measure/update-for-measure-content';

const puReviewPipe = new ProgressUpdateReviewPipe();
const capitalizeFirstPipe = new CapitalizeFirstPipe();

export const tableOfContentTabHeaderMap = {
  sheet: 'Sheet',
  description: 'Description',
};

export const progressUpdatesTabHeaderMap = {
  pu1Id: 'PU1 ID',
  organisationName: 'Name of the responsible undertaking',
  companyRegistrationNumber: 'Company registration number of the responsible undertaking',
  pu1SubmissionDate: 'PU1 Submission Date',
  apId: 'AP ID',
  apSubmissionDate: 'AP Submission Date',
  otherResponsibleUndertakingName: 'Name of the other responsible undertaking',
  otherResponsibleUndertakingCrn: 'Company registration number of the other responsible undertaking',
};

export const measuresTabHeaderMap = {
  pu1Id: 'PU1 ID',
  measureName: 'Measure Name',
  isPu1AddedMeasure: 'This is a new measure added in PU1 (*Info from Action Plan)',
  totalEnergySavings:
    'Total Energy savings (KWh) expected from this measure estimate for the period 6 December 2023 to 5 December 2027 (*Info from Action Plan)',
  measureScheme: 'Does the reason for implementing the measure relate to another scheme or requirement? (optional)',
  measureIsImplemented: 'Has the measure been implemented?',
  measureImplementedByTheDateInActionPlan: 'Was the measure implemented by the date proposed in the action plan?',

  reportReduction2024To2025: UPDATE_FOR_MEASURE_FORM_CONTENT.reportReduction2024To2025.title,
  reductionEnergyConsumption2024To2025:
    UPDATE_FOR_MEASURE_FORM_CONTENT.reductionEnergyConsumption2024To2025.title + ' (KWh)',
  reportReduction2023To2024: UPDATE_FOR_MEASURE_FORM_CONTENT.reportReduction2023To2024.title,
  reductionEnergyConsumption2023To2024:
    UPDATE_FOR_MEASURE_FORM_CONTENT.reductionEnergyConsumption2023To2024.title + ' (KWh)',
  estimationMethodType: 'Estimation Method for the period between 6 December 2024 and 5 December 2025',
  estimationMethodDescription: 'Description of other reasonable estimation method, if applicable',
  measureContext: 'Additonal context for the measure (optional)',
};

export const confirmationTabHeaderMap = {
  pu1Id: 'PU1 ID',
  esosAssessment: capitalizeFirstPipe.transform(puReviewPipe.transform('ESOS_ACTION_PLAN_COMPLIANCE')),
  estimationMethod: capitalizeFirstPipe.transform(puReviewPipe.transform('ESTIMATION_METHOD_DOCUMENTED')),
};

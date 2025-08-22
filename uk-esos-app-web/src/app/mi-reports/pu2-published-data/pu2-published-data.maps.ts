import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { ProgressUpdateReviewPipe } from '@shared/pipes/pu-review.pipe';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from '@tasks/progress-update-2/subtasks/pu2-energy-efficiency-measures/update-for-measure/update-for-measure-content';

const puReviewPipe = new ProgressUpdateReviewPipe();
const capitalizeFirstPipe = new CapitalizeFirstPipe();

export const tableOfContentTabHeaderMap = {
  sheet: 'Sheet',
  description: 'Description',
};

export const progressUpdatesTabHeaderMap = {
  pu2Id: 'PU2 ID',
  organisationName: 'Name of the responsible undertaking',
  companyRegistrationNumber: 'Company registration number of the responsible undertaking',
  pu2SubmissionDate: 'PU2 Submission Date',
  apId: 'AP ID',
  apSubmissionDate: 'AP Submission Date',
  pu1Id: 'PU1 ID',
  pu1SubmissionDate: 'PU1 Submission Date',
  otherResponsibleUndertakingName: 'Name of the other responsible undertaking',
  otherResponsibleUndertakingCrn: 'Company registration number of the other responsible undertaking',
};

export const measuresTabHeaderMap = {
  pu2Id: 'PU2 ID',
  measureName: 'Measure Name',
  isPu2AddedMeasure: 'This is a new measure added in PU2 (*Info from PU1)',
  measureScheme: 'Does the reason for implementing the measure relate to another scheme or requirement? (optional)',
  measureIsImplemented: 'Has the measure been implemented?',
  measureImplementedByTheDateInActionPlan: 'Was the measure implemented by the date proposed in the action plan?',
  reportReduction2025To2026: UPDATE_FOR_MEASURE_FORM_CONTENT.reportReduction2025To2026.title,
  reductionEnergyConsumption2025To2026:
    UPDATE_FOR_MEASURE_FORM_CONTENT.reductionEnergyConsumption2025To2026.title + ' (KWh)',
  estimationMethodType: 'Estimation Method for the period between 6 December 2025 and 5 December 2026',
  estimationMethodDescription: 'Description of other reasonable estimation method',
  measureContext: 'Additonal context for the measure (optional)',
};

export const confirmationTabHeaderMap = {
  pu2Id: 'PU2 ID',
  esosAssessment: capitalizeFirstPipe.transform(puReviewPipe.transform('ESOS_ACTION_PLAN_COMPLIANCE')),
  estimationMethod: capitalizeFirstPipe.transform(puReviewPipe.transform('ESTIMATION_METHOD_DOCUMENTED')),
};

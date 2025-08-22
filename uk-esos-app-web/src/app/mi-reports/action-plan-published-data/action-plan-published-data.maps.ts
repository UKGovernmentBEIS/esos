import { ActionPlanReviewPipe } from '@shared/pipes/action-plan-review.pipe';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';
import { MEASURE_FORM_CONTENT } from '@tasks/action-plan/subtasks/energy-efficiency-measures/measure/measure-content';
import { PROPOSED_MEASURES_CONTENT } from '@tasks/action-plan/subtasks/energy-efficiency-measures/proposed-measures/proposed-measures-content';

const actionPlanReviewPipe = new ActionPlanReviewPipe();
const capitalizeFirstPipe = new CapitalizeFirstPipe();

export const tableOfContentTabHeaderMap = {
  sheet: 'Sheet',
  description: 'Description',
};

export const actionPlansTabHeaderMap = {
  apId: 'AP ID',
  organisationName: 'Organisation Name',
  companyRegistrationNumber: 'CRN',
  apSubmissionDate: 'AP Submission Date',
  nocId: 'NOC ID',
  nocSubmissionDate: 'NOC Submission Date',
  haveEnergyEfficiencyMeasures: PROPOSED_MEASURES_CONTENT.title,
  noMeasureContext: 'Context if no measures proposed (optional)',
};

export const measuresTabHeaderMap = {
  apId: 'AP ID',
  measureName: 'Measure Name',
  isEnergySavingsOpportunityReportedInAudit: MEASURE_FORM_CONTENT.isEnergySavingsOpportunityReportedInAudit.title,
  measureScheme: MEASURE_FORM_CONTENT.measureScheme.title,
  implementationDateForMeasure: 'Implementation Date',
  savingsEstimateBuildings:
    'Energy savings expected from this measure by organisational purpose estimate - Buildings (KWh)',
  savingsEstimateTransport:
    'Energy savings expected from this measure by organisational purpose estimate - Transport (KWh)',
  savingsEstimateIndustrial:
    'Energy savings expected from this measure by organisational purpose estimate - Industrial Processes (KWh)',
  savingsEstimateOther:
    'Energy savings expected from this measure by organisational purpose estimate - Other energy uses (KWh)',
  savingsEstimateTotal: 'Energy savings expected from this measure by organisational purpose estimate - Total (KWh)',
  energySavingsEstimateCalculatedType: MEASURE_FORM_CONTENT.energySavingsEstimateCalculatedType.title,
  estimationMethodDescription: 'Other estimation method',
  measureContext: 'Additonal context for the measure (optional)',
};

export const confirmationTabHeaderMap = {
  apId: 'AP ID',
  esosAssessment: capitalizeFirstPipe.transform(actionPlanReviewPipe.transform('ESOS_ASSESSMENT_NOTIFICATION')),
  estimationMethod: capitalizeFirstPipe.transform(actionPlanReviewPipe.transform('ESTIMATION_METHOD_DESCRIPTION')),
};

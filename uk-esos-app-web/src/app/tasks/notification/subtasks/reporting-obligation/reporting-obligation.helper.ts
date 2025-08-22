export enum ReportingObligationStep {
  QUALIFICATION_TYPE = 'qualificationType',
  QUALIFICATION_REASONS = 'qualificationReasons',
  NO_QUALIFICATION_REASON = 'noQualificationReason',
  ENERGY_RESPONSIBILITY = 'energyResponsibility',
  COMPLIANCE_ROUTE_DISTRIBUTION = 'complianceRouteDistribution',
  SUMMARY = 'summary',
}

export enum ReportingObligationStepUrl {
  QUALIFICATION_TYPE = 'qualification-type',
  QUALIFICATION_REASONS = 'qualification-reasons',
  NO_QUALIFICATION_REASON = 'no-qualification-reason',
  ENERGY_RESPONSIBILITY = 'energy-responsibility',
  COMPLIANCE_ROUTE_DISTRIBUTION = 'compliance-route-distribution',
}

export const REPORTING_OBLIGATION_SUBTASK = 'reportingObligation';

export const REPORTING_OBLIGATION_CONTENT_MAP = {
  title: 'Reporting obligation',
  [ReportingObligationStep.QUALIFICATION_TYPE]: {
    title: 'Does your organisation qualify for ESOS?',
  },
  [ReportingObligationStep.NO_QUALIFICATION_REASON]: {
    title: 'Explain why your organisation does not qualify for ESOS',
  },
  [ReportingObligationStep.QUALIFICATION_REASONS]: {
    title:
      'Select the reason that your organisation, or another organisation in its corporate group, qualifies for ESOS',
  },
  [ReportingObligationStep.ENERGY_RESPONSIBILITY]: {
    title: 'Are the organisations in this notification responsible for any energy under ESOS?',
  },
  [ReportingObligationStep.COMPLIANCE_ROUTE_DISTRIBUTION]: {
    title: 'Enter a breakdown of the total energy consumption covered by each compliance route in this notification',
  },
};

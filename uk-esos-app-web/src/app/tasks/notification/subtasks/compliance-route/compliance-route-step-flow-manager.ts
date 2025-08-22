import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import {
  COMPLIANCE_ROUTE_SUB_TASK,
  CurrentStep,
  showComplianceRouteQuestions,
  WizardStep,
} from './compliance-route.helper';
import { isWizardCompleted } from './compliance-route-wizard-steps';

export class ComplianceRouteStepFlowManager extends StepFlowManager {
  override subtask = COMPLIANCE_ROUTE_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const complianceRoute = this.store.select(notificationQuery.selectComplianceRoute)();
    const category = this.store.select(notificationQuery.selectReportingObligationCategory)();
    const energyAudits = this.store.select(notificationQuery.selectReportingObligation)().reportingObligationDetails
      .complianceRouteDistribution.energyAuditsPct;
    const energyConsumptionProfilingUsed = complianceRoute?.energyConsumptionProfilingUsed;
    const partsProhibitedFromDisclosingExist = complianceRoute?.partsProhibitedFromDisclosingExist;

    switch (currentStep) {
      case CurrentStep.DATA_ESTIMATED:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? showComplianceRouteQuestions(category, energyAudits)
            ? `../${WizardStep.TWELVE_MONTHS_VERIFIABLE_DATA}`
            : `../${WizardStep.ESTIMATION_METHODS_RECORDED}`
          : WizardStep.SUMMARY;

      case CurrentStep.TWELVE_MONTHS_VERIFIABLE_DATA:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? `../${WizardStep.ESTIMATION_METHODS_RECORDED}`
          : WizardStep.SUMMARY;

      case CurrentStep.ESTIMATION_METHODS_RECORDED:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? showComplianceRouteQuestions(category, energyAudits)
            ? `../${WizardStep.ENERGY_CONSUMPTION_PROFILING}`
            : `../${WizardStep.PROHIBITED_DISCLOSING}`
          : WizardStep.SUMMARY;

      case CurrentStep.ENERGY_CONSUMPTION_PROFILING:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? energyConsumptionProfilingUsed === 'YES'
            ? `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED}`
            : `../${WizardStep.ENERGY_CONSUMPTION_PROFILING_NOT_USED_RECORDED}`
          : WizardStep.SUMMARY;

      case CurrentStep.ENERGY_CONSUMPTION_PROFILING_METHODS_RECORDED:
      case CurrentStep.ENERGY_CONSUMPTION_PROFILING_NOT_USED_RECORDED:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? `../${WizardStep.ENERGY_AUDITS}`
          : WizardStep.SUMMARY;

      case CurrentStep.ENERGY_AUDITS:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? `../${WizardStep.PROHIBITED_DISCLOSING}`
          : WizardStep.SUMMARY;

      case CurrentStep.ADD_ENERGY_AUDIT:
      case CurrentStep.REMOVE_ENERGY_AUDIT:
        return `../${WizardStep.ENERGY_AUDITS}`;

      case CurrentStep.EDIT_ENERGY_AUDIT:
        return `../../${WizardStep.ENERGY_AUDITS}`;

      case CurrentStep.REMOVE_ENERGY_AUDIT_SUMMARY:
        return './';

      case CurrentStep.PROHIBITED_DISCLOSING:
        return !isWizardCompleted(complianceRoute, category, energyAudits) && partsProhibitedFromDisclosingExist
          ? `../${WizardStep.PROHIBITED_DISCLOSING_PARTS}`
          : WizardStep.SUMMARY;

      case CurrentStep.PROHIBITED_DISCLOSING_PARTS:
        return !isWizardCompleted(complianceRoute, category, energyAudits)
          ? `../${WizardStep.PROHIBITED_DISCLOSING_REASON}`
          : WizardStep.SUMMARY;

      case CurrentStep.PROHIBITED_DISCLOSING_REASON:
        return WizardStep.SUMMARY;

      default:
        return '../../';
    }
  }
}

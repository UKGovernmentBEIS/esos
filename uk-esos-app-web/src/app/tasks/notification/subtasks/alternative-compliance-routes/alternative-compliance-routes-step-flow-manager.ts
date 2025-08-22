import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
  isDecEnabled,
  isGdaEnabled,
  isIso50001Enabled,
  WizardStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';

import { ComplianceRouteDistribution, NocP3 } from 'esos-api';

export class AlternativeComplianceRoutesStepFlowManager extends StepFlowManager {
  override subtask: keyof NocP3 = ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK;

  override resolveNextStepRoute(currentStep: string): string {
    const complianceRouteDistribution = this.store.select(notificationQuery.selectReportingObligation)()
      .reportingObligationDetails.complianceRouteDistribution;
    const reportingObligationCategory = this.store.select(notificationQuery.selectReportingObligationCategory)();

    switch (currentStep) {
      case CurrentStep.TOTAL_ENERGY_CONSUMPTION_REDUCTION:
        return reportingObligationCategory === 'ISO_50001_COVERING_ENERGY_USAGE'
          ? `../${WizardStep.ASSETS}`
          : `../${WizardStep.ENERGY_CONSUMPTION_REDUCTION}`;

      case CurrentStep.ENERGY_CONSUMPTION_REDUCTION:
        return `../${WizardStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES}`;

      case CurrentStep.ENERGY_CONSUMPTION_REDUCTION_CATEGORIES:
        return `../${WizardStep.ASSETS}`;

      case CurrentStep.ASSETS:
        return this.resolveAssetsStep(complianceRouteDistribution);

      case CurrentStep.ISO_50001_CERTIFICATE_DETAILS:
        return this.resolveISO50001Step(complianceRouteDistribution);

      case CurrentStep.DEC_CERTIFICATES_DETAILS:
        return this.resolveDecCertificatesStep(complianceRouteDistribution);

      case CurrentStep.GDA_CERTIFICATES_DETAILS:
        return WizardStep.SUMMARY;

      default:
        return '../../';
    }
  }

  private resolveAssetsStep(complianceRouteDistribution: ComplianceRouteDistribution) {
    if (isIso50001Enabled(complianceRouteDistribution)) {
      return `../${WizardStep.ISO_50001_CERTIFICATE_DETAILS}`;
    }

    if (isDecEnabled(complianceRouteDistribution)) {
      return `../${WizardStep.DEC_CERTIFICATES_DETAILS}`;
    }

    if (isGdaEnabled(complianceRouteDistribution)) {
      return `../${WizardStep.GDA_CERTIFICATES_DETAILS}`;
    }

    throw Error(`###StepFlowManager### :: Unhandled case for : "${CurrentStep.ASSETS}"`);
  }

  private resolveISO50001Step(complianceRouteDistribution: ComplianceRouteDistribution) {
    if (isDecEnabled(complianceRouteDistribution)) {
      return `../${WizardStep.DEC_CERTIFICATES_DETAILS}`;
    }

    if (isGdaEnabled(complianceRouteDistribution)) {
      return `../${WizardStep.GDA_CERTIFICATES_DETAILS}`;
    }

    return WizardStep.SUMMARY;
  }

  private resolveDecCertificatesStep(complianceRouteDistribution: ComplianceRouteDistribution) {
    return complianceRouteDistribution.greenDealAssessmentPct > 0
      ? `../${WizardStep.GDA_CERTIFICATES_DETAILS}`
      : WizardStep.SUMMARY;
  }
}

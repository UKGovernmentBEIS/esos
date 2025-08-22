import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import {
  ORGANISATION_STRUCTURE_SUB_TASK,
  OrganisationStructureCurrentStep,
  OrganisationStructureWizardStep,
} from './organisation-structure.helper';

export class OrganisationStructureStepFlowManager extends StepFlowManager {
  override subtask = ORGANISATION_STRUCTURE_SUB_TASK;

  resolveNextStepRoute(currentStep: string): string {
    const organisationStructure = this.store.select(notificationQuery.selectOrganisationStructure)();

    switch (currentStep) {
      case OrganisationStructureCurrentStep.HIGHEST_PARENT:
        return `../${OrganisationStructureWizardStep.INCLUDE_UNDERTAKINGS}`;
      case OrganisationStructureCurrentStep.INCLUDE_UNDERTAKINGS:
        return organisationStructure.isNonComplyingUndertakingsIncluded
          ? `../${OrganisationStructureWizardStep.UNDERTAKING_LIST}`
          : `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.UNDERTAKING_LIST:
        return `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.ADD:
        return `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.LIST:
        return OrganisationStructureWizardStep.SUMMARY;
      case OrganisationStructureCurrentStep.EDIT:
        return `../../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.UPLOAD_CSV:
        return `../${OrganisationStructureWizardStep.LIST}`;
      case OrganisationStructureCurrentStep.SUMMARY:
        return '../../';

      default:
        return './';
    }
  }
}

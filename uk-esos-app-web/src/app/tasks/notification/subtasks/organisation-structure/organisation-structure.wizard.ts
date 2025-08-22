import { OrganisationStructure } from 'esos-api';

export const isWizardCompleted = (organisationStructure: OrganisationStructure) => {
  return (
    organisationStructure?.isHighestParent != null &&
    (organisationStructure?.isNonComplyingUndertakingsIncluded === false ||
      (organisationStructure?.isNonComplyingUndertakingsIncluded === true &&
        organisationStructure?.organisationUndertakingDetails?.length > 0)) &&
    organisationStructure?.isGroupStructureChartProvided != null
  );
};

import { OrganisationDetails } from 'esos-api';

export interface OrganisationStructureListTemplateViewModel {
  header: string;
  isListPreviousPage: boolean;
  wizardStep: { [s: string]: string };
  isEditable: boolean;
  organisationDetails: OrganisationDetails;
}

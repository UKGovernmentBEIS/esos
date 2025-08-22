import { OrganisationAssociatedWithRU } from 'esos-api';

export const sortOrganisations = (organisations: Array<OrganisationAssociatedWithRU>) => {
  return [...(organisations ?? [])].sort((a, b) => {
    const fa = a.organisationName.toLowerCase(),
      fb = b.organisationName.toLowerCase();

    return fa > fb ? 1 : fa < fb ? -1 : 0;
  });
};

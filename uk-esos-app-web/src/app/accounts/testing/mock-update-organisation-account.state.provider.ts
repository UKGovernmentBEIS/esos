import { mockUpdateOrganisationAccountStore } from './mock-update-organisation-account.store';

export const mockUpdateOrganisationAccountStateProvider = {
  get name() {
    return mockUpdateOrganisationAccountStore.state.name;
  },
  get competentAuthority() {
    return mockUpdateOrganisationAccountStore.state.competentAuthority;
  },
  get address() {
    const state = mockUpdateOrganisationAccountStore.state || {};
    return {
      line1: state.line1,
      line2: state.line2,
      city: state.city,
      county: state.county,
      postcode: state.postcode,
    };
  },
  get registrationStatus() {
    return mockUpdateOrganisationAccountStore.state.registrationStatus;
  },
  get registrationNumber() {
    return mockUpdateOrganisationAccountStore.state.registrationNumber;
  },
  get codes() {
    return mockUpdateOrganisationAccountStore.state.codes;
  },
  get type() {
    return mockUpdateOrganisationAccountStore.state.type;
  },
  get otherTypeName() {
    return mockUpdateOrganisationAccountStore.state.otherTypeName;
  },
};

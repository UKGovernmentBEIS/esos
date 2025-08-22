import { mockCreateOrganisationAccountStore } from './mock-create-organisation-account.store';

export const mockCreateOrganisationAccountStateProvider = {
  get name() {
    return mockCreateOrganisationAccountStore.state.name;
  },
  get competentAuthority() {
    return mockCreateOrganisationAccountStore.state.competentAuthority;
  },
  get address() {
    return mockCreateOrganisationAccountStore.state.address;
  },
  get registrationStatus() {
    return mockCreateOrganisationAccountStore.state.registrationStatus;
  },
  get registrationNumber() {
    return mockCreateOrganisationAccountStore.state.registrationNumber;
  },
};

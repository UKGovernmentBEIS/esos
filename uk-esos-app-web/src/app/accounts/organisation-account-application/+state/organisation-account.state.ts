import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

export interface OrganisationAccountOpeningApplicationState {
  registrationStatus: boolean;
  registrationNumber?: string;
  name: string;
  address: CountyAddressDTO;
  competentAuthority: OrganisationAccountDTO['competentAuthority'];
}

export const initialState: OrganisationAccountOpeningApplicationState = {
  registrationStatus: null,
  registrationNumber: null,
  name: null,
  address: {
    line1: null,
    line2: null,
    city: null,
    county: null,
    postcode: null,
  },
  competentAuthority: 'ENGLAND', // Defaulted to 'ENGLAND', can be changed as necessary.
};

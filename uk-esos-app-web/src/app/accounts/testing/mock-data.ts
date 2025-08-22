import { address } from '@testing';

import {
  AccountNoteResponse,
  AccountOperatorsUsersAuthoritiesInfoDTO,
  AccountSearchResults,
  OperatorUserDTO,
  OrganisationAccountDTO,
  OrganisationAccountPayload,
  RequestDetailsSearchResults,
  RequestNoteResponse,
  RoleDTO,
  UserAuthorityInfoDTO,
  UserStateDTO,
} from 'esos-api';

export const mockOperatorListData: AccountOperatorsUsersAuthoritiesInfoDTO = {
  authorities: [
    {
      authorityStatus: 'ACTIVE',
      firstName: 'First',
      lastName: 'User',
      roleCode: 'operator_admin',
      roleName: 'Advanced user',
      userId: 'userTest1',
      authorityCreationDate: '2019-12-21T13:42:43.050682Z',
      locked: true,
    },
    {
      authorityStatus: 'ACTIVE',
      firstName: 'John',
      lastName: 'Doe',
      roleCode: 'operator',
      roleName: 'Restricted user',
      userId: 'userTest2',
      authorityCreationDate: '2020-12-21T13:42:43.050682Z',
      locked: false,
    },
    {
      authorityStatus: 'DISABLED',
      firstName: 'Darth',
      lastName: 'Vader',
      roleCode: 'operator',
      roleName: 'Restricted user',
      userId: 'userTest3',
      authorityCreationDate: '2020-10-13T13:42:43.050682Z',
      locked: false,
    },
    {
      authorityStatus: 'ACTIVE',
      firstName: 'anakin',
      lastName: 'skywalker',
      roleCode: 'operator_admin',
      roleName: 'Advanced user',
      userId: 'userTest4',
      authorityCreationDate: '2021-01-13T13:42:43.050682Z',
      locked: false,
    },
  ] as UserAuthorityInfoDTO[],
  contactTypes: {
    PRIMARY: 'userTest1',
    SECONDARY: 'userTest4',
  },
  editable: true,
};

export const mockOperatorRoleCodes: RoleDTO[] = [
  {
    name: 'Advanced user',
    code: 'operator_admin',
  },
  {
    name: 'Restricted user',
    code: 'operator',
  },
];

export const operator: OperatorUserDTO = {
  address,
  email: 'test@host.com',
  firstName: 'Mary',
  lastName: 'Za',
  jobTitle: 'job title',
  mobileNumber: { countryCode: '44', number: '1234567890' },
  phoneNumber: { countryCode: '44', number: '1234567890' },
};

export const operatorUserRole: UserStateDTO = {
  status: 'ENABLED',
  roleType: 'OPERATOR',
  userId: 'asdf4',
};

export const regulatorUserRole: UserStateDTO = {
  status: 'ENABLED',
  roleType: 'REGULATOR',
  userId: 'asdf4',
};

export const mockedOrganisationAccount: OrganisationAccountDTO = {
  id: 1,
  registrationNumber: 'Registration number',
  name: 'Organisation name',
  line1: 'Line 1',
  city: 'City',
  county: 'Aberdeenshire',
  postcode: 'Post code',
  competentAuthority: 'ENGLAND',
  organisationId: 'ORG000001',
  status: 'LIVE',
  type: 'OTHER',
  otherTypeName: 'some classification name',
  codes: ['CodeA', 'CodeB', 'CodeC'],
};

export const mockedOrganisationAccountPayload: OrganisationAccountPayload = {
  registrationNumber: 'Registration number',
  name: 'Organisation name',
  line1: 'Line 1',
  city: 'City',
  county: 'Aberdeenshire',
  postcode: 'Post code',
  competentAuthority: 'ENGLAND',
  type: 'OTHER',
  otherTypeName: 'some classification name',
  codes: ['CodeA', 'CodeB', 'CodeC'],
};

export const mockWorkflowResults: RequestDetailsSearchResults = {
  requestDetails: [
    {
      id: '1',
      requestType: 'ORGANISATION_ACCOUNT_OPENING',
      requestStatus: 'APPROVED',
      creationDate: new Date('2022-12-11').toISOString(),
    },
  ],
  total: 2,
};

export const mockReportsResults: RequestDetailsSearchResults = {
  requestDetails: [],
  total: 0,
};

export const mockYearEmissionsResults = {
  '2020': '10',
};

export const mockAccountNotesResults: AccountNoteResponse = {
  accountNotes: [
    {
      lastUpdatedOn: '2022-11-24T14:00:12.723Z',
      payload: { note: 'The note 1', files: { '0500d8b5-8cfb-4430-8edd-75f7612a7287': 'file 1' } },
      submitter: 'Submitter 1',
    },
    {
      lastUpdatedOn: '2022-11-25T15:00:12.723Z',
      payload: { note: 'The note 2' },
      submitter: 'Submitter 2',
    },
  ],
  totalItems: 2,
};

export const mockRequestNotesResults: RequestNoteResponse = {
  requestNotes: [
    {
      lastUpdatedOn: '2022-11-24T14:00:12.723Z',
      payload: { note: 'The note 1', files: { '0500d8b5-8cfb-4430-8edd-75f7612a7287': 'file 1' } },
      submitter: 'Submitter 1',
    },
    {
      lastUpdatedOn: '2022-11-25T15:00:12.723Z',
      payload: { note: 'The note 2' },
      submitter: 'Submitter 2',
    },
  ],
  totalItems: 2,
};

export const mockAccountResults: AccountSearchResults = {
  accounts: [
    { id: 1, name: 'account1', organisationId: 'EM00001', status: 'LIVE' },
    { id: 1, name: 'account2', organisationId: 'EM00002', status: 'LIVE' },
    { id: 1, name: 'account3', organisationId: 'EM00003', status: 'LIVE' },
  ],
  total: 3,
};

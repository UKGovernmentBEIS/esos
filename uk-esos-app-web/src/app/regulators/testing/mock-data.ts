import {
  AuthorityManagePermissionDTO,
  RegulatorUserDTO,
  RegulatorUsersAuthoritiesInfoDTO,
  UserStateDTO,
} from 'esos-api';

export const mockRegulatorsRouteData: { regulators: RegulatorUsersAuthoritiesInfoDTO } = {
  regulators: {
    caUsers: [
      {
        userId: '1reg',
        firstName: 'Alfyn',
        lastName: 'Octo',
        authorityStatus: 'DISABLED',
        locked: false,
        authorityCreationDate: '2020-12-14T12:38:12.846716Z',
      },
      {
        userId: '2reg',
        firstName: 'Therion',
        lastName: 'Path',
        authorityStatus: 'ACTIVE',
        locked: true,
        authorityCreationDate: '2020-12-15T12:38:12.846716Z',
      },
      {
        userId: '3reg',
        firstName: 'Olberik',
        lastName: 'Traveler',
        authorityStatus: 'ACTIVE',
        locked: true,
        authorityCreationDate: '2020-11-10T12:38:12.846716Z',
      },
      {
        userId: '4reg',
        firstName: 'andrew',
        lastName: 'webber',
        authorityStatus: 'ACTIVE',
        locked: false,
        authorityCreationDate: '2021-01-10T12:38:12.846716Z',
      },
      {
        userId: '5reg',
        firstName: 'William',
        lastName: 'Walker',
        authorityStatus: 'PENDING',
        locked: true,
        authorityCreationDate: '2021-02-8T12:38:12.846716Z',
      },
    ],
    editable: true,
  },
};

export const mockRegulatorUserStatus: UserStateDTO = {
  status: 'ENABLED',
  roleType: 'REGULATOR',
  userId: '111',
};

export const mockRegulatorUser: {
  user: RegulatorUserDTO;
  permissions: AuthorityManagePermissionDTO;
} = {
  user: {
    email: 'test@host.com',
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'developer',
    phoneNumber: '23456',
    mobileNumber: '55444',
  },
  permissions: {
    editable: true,
    permissions: {
      ASSIGN_REASSIGN_TASKS: 'NONE',
      MANAGE_USERS_AND_CONTACTS: 'NONE',
      REVIEW_ORGANISATION_ACCOUNT: 'VIEW_ONLY',
      RETURN_NOC: 'NONE',
      RETURN_ACTION_PLAN: 'NONE',
      RETURN_PROGRESS_UPDATE_1: 'NONE',
      RETURN_PROGRESS_UPDATE_2: 'NONE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'NONE',
      MANAGE_PARTICIPANT_USERS: 'NONE',
      ACCOUNT_CLOSURE: 'NONE',
    },
  },
};

export const mockRegulatorRolePermissions = [
  'REVIEW_ORGANISATION_ACCOUNT',
  'MANAGE_USERS_AND_CONTACTS',
  'ASSIGN_REASSIGN_TASKS',
];

export const mockRegulatorBasePermissions = [
  {
    name: 'Regulator admin team',
    code: 'regulator_admin_team',
    rolePermissions: {
      REVIEW_ORGANISATION_ACCOUNT: 'VIEW_ONLY',
      RETURN_NOC: 'NONE',
      RETURN_ACTION_PLAN: 'NONE',
      RETURN_PROGRESS_UPDATE_1: 'NONE',
      RETURN_PROGRESS_UPDATE_2: 'NONE',
      MANAGE_USERS_AND_CONTACTS: 'NONE',
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'NONE',
      MANAGE_PARTICIPANT_USERS: 'NONE',
      ACCOUNT_CLOSURE: 'NONE',
    },
  },
  {
    name: 'Regulator team leader',
    code: 'regulator_team_leader',
    rolePermissions: {
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
      RETURN_NOC: 'NONE',
      RETURN_ACTION_PLAN: 'NONE',
      RETURN_PROGRESS_UPDATE_1: 'NONE',
      RETURN_PROGRESS_UPDATE_2: 'NONE',
      MANAGE_USERS_AND_CONTACTS: 'NONE',
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'NONE',
      MANAGE_PARTICIPANT_USERS: 'NONE',
      ACCOUNT_CLOSURE: 'NONE',
    },
  },
  {
    name: 'CA super user',
    code: 'ca_super_user',
    rolePermissions: {
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
      RETURN_NOC: 'EXECUTE',
      RETURN_ACTION_PLAN: 'EXECUTE',
      RETURN_PROGRESS_UPDATE_1: 'EXECUTE',
      RETURN_PROGRESS_UPDATE_2: 'EXECUTE',
      MANAGE_USERS_AND_CONTACTS: 'EXECUTE',
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
      MANAGE_PARTICIPANT_USERS: 'EXECUTE',
      ACCOUNT_CLOSURE: 'EXECUTE',
    },
  },
  {
    name: 'Service super user',
    code: 'service_super_user',
    rolePermissions: {
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
      RETURN_NOC: 'EXECUTE',
      RETURN_ACTION_PLAN: 'EXECUTE',
      RETURN_PROGRESS_UPDATE_1: 'EXECUTE',
      RETURN_PROGRESS_UPDATE_2: 'EXECUTE',
      MANAGE_USERS_AND_CONTACTS: 'EXECUTE',
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'EXECUTE',
      MANAGE_PARTICIPANT_USERS: 'EXECUTE',
      ACCOUNT_CLOSURE: 'EXECUTE',
    },
  },
  {
    name: 'Regulator technical officer',
    code: 'regulator_technical_officer',
    rolePermissions: {
      REVIEW_ORGANISATION_ACCOUNT: 'EXECUTE',
      RETURN_NOC: 'NONE',
      RETURN_ACTION_PLAN: 'NONE',
      RETURN_PROGRESS_UPDATE_1: 'NONE',
      RETURN_PROGRESS_UPDATE_2: 'NONE',
      MANAGE_USERS_AND_CONTACTS: 'NONE',
      ASSIGN_REASSIGN_TASKS: 'EXECUTE',
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: 'NONE',
      MANAGE_PARTICIPANT_USERS: 'NONE',
      ACCOUNT_CLOSURE: 'NONE',
    },
  },
];

export const mockRegulatorPermissionGroups = {
  REVIEW_ORGANISATION_ACCOUNT: ['NONE', 'VIEW_ONLY', 'EXECUTE'],
  RETURN_NOC: ['NONE', 'EXECUTE'],
  RETURN_ACTION_PLAN: ['NONE', 'EXECUTE'],
  RETURN_PROGRESS_UPDATE_1: ['NONE', 'EXECUTE'],
  RETURN_PROGRESS_UPDATE_2: ['NONE', 'EXECUTE'],
  MANAGE_USERS_AND_CONTACTS: ['NONE', 'EXECUTE'],
  ASSIGN_REASSIGN_TASKS: ['NONE', 'EXECUTE'],
  MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: ['NONE', 'EXECUTE'],
  MANAGE_PARTICIPANT_USERS: ['NONE', 'EXECUTE'],
  ACCOUNT_CLOSURE: ['NONE', 'EXECUTE'],
};

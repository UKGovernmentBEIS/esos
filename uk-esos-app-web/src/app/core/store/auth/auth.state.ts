import { Permissions } from '@shared/interfaces';
import { KeycloakProfile } from 'keycloak-js';

import { ApplicationUserDTO, TermsDTO, UserStateDTO } from 'esos-api';

export const EsosAccount = 'ORGANISATION';
export type AccountType = typeof EsosAccount;

export interface AuthState {
  user: ApplicationUserDTO;
  userProfile: KeycloakProfile;
  userState: UserStateDTO;
  terms: TermsDTO;
  isLoggedIn: boolean;
  regulatorPermissions: Permissions;
}

export const initialState: AuthState = {
  user: null,
  userProfile: null,
  userState: null,
  terms: null,
  isLoggedIn: null,
  regulatorPermissions: null,
};

import { map, OperatorFunction, pipe } from 'rxjs';

import { mapAccountPermissionsToActions } from '@accounts/shared/account-related-actions/account-allowed-actions.map';
import { AuthState } from '@core/store/auth/auth.state';
import { Permissions, TextLinkItem } from '@shared/interfaces';
import { KeycloakProfile } from 'keycloak-js';

import { ApplicationUserDTO, TermsDTO, UserStateDTO } from 'esos-api';

export const selectUserProfile: OperatorFunction<AuthState, KeycloakProfile> = map((state) => state.userProfile);
export const selectTerms: OperatorFunction<AuthState, TermsDTO> = map((state) => state.terms);
export const selectIsLoggedIn: OperatorFunction<AuthState, boolean> = map((state) => state.isLoggedIn);
export const selectUser: OperatorFunction<AuthState, ApplicationUserDTO> = map((state) => state.user);
export const selectUserState: OperatorFunction<AuthState, UserStateDTO> = map((state) => state.userState);
export const selectRegulatorPermissions: OperatorFunction<AuthState, Permissions> = map(
  (state) => state.regulatorPermissions,
);

export const selectUserRoleType: OperatorFunction<AuthState, UserStateDTO['roleType']> = pipe(
  selectUserState,
  map((state) => state?.roleType),
);
export const selectUserId: OperatorFunction<AuthState, string> = pipe(
  selectUserState,
  map((state) => state?.userId),
);
export const selectLoginStatus: OperatorFunction<AuthState, UserStateDTO['status']> = pipe(
  selectUserState,
  map((state) => state?.status),
);
export const selectAuthenticationStatus: OperatorFunction<AuthState, string> = pipe(
  selectUserProfile,
  map((userProfile) => (userProfile?.attributes?.['status'] as string[] | undefined)?.[0]),
);
export const selectRegulatorRelatedActions: OperatorFunction<AuthState, TextLinkItem[]> = pipe(
  selectRegulatorPermissions,
  map((regulatorPermissions) => mapAccountPermissionsToActions(regulatorPermissions)),
);
export const selectHasRegulatorPermission = (
  key: string,
  action: 'NONE' | 'VIEW_ONLY' | 'EXECUTE',
): OperatorFunction<AuthState, boolean> =>
  pipe(
    selectRegulatorPermissions,
    map((regulatorPermissions) => regulatorPermissions?.[key] === action),
  );

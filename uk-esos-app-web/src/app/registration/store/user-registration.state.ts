import { AuthStore } from '@core/store';

import { OperatorUserRegistrationDTO } from 'esos-api';

export interface UserRegistrationState {
  userRegistrationDTO?: OperatorUserRegistrationDTO;
  email?: string;
  token?: string;
  isInvited?: boolean;
}

export const initialState: (authStore: AuthStore) => UserRegistrationState = (authStore: AuthStore) => {
  return {
    userRegistrationDTO: {
      firstName: authStore.getState()?.user?.firstName,
      lastName: authStore.getState()?.user?.lastName,
      address: { line1: null, city: null, postcode: null },
    },
    email: authStore.getState()?.user?.email,
    token: null,
    isInvited: false,
  };
};

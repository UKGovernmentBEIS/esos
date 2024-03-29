import { OperatorInvitedUserInfoDTO, OperatorUserRegistrationDTO } from 'esos-api';

export interface UserRegistrationState {
  userRegistrationDTO?: Omit<OperatorUserRegistrationDTO, 'emailToken'>;
  email?: string;
  password?: string;
  token?: string;
  isSummarized?: boolean;
  isInvited?: boolean;
  invitationStatus?: OperatorInvitedUserInfoDTO['invitationStatus'];
}

export const initialState: UserRegistrationState = {
  userRegistrationDTO: null,
  email: null,
  password: null,
  token: null,
  isSummarized: false,
  isInvited: false,
  invitationStatus: null,
};

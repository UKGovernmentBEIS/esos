import { RequestDetailsDTO } from 'esos-api';

export const workflowTypesDomainMap: Record<string, Record<string, RequestDetailsDTO['requestType'][]>> = {
  ORGANISATION: {
    'Account Creation': ['ORGANISATION_ACCOUNT_OPENING'],
    'Account Closure': ['ACCOUNT_CLOSURE'],
  },
};

import { RequestDetailsDTO } from 'esos-api';

export const workflowDetailsTypesMap: Partial<Record<RequestDetailsDTO['requestType'], string>> = {
  ORGANISATION_ACCOUNT_OPENING: 'Account Creation',
  NOTIFICATION_OF_COMPLIANCE_P3: 'Phase 3 notification of compliance',
  ACTION_PLAN_P3: 'Phase 3 action plan',
  ACCOUNT_CLOSURE: 'Account Closure',
  PROGRESS_UPDATE_1_P3: 'Phase 3 progress update 1',
  PROGRESS_UPDATE_2_P3: 'Phase 3 progress update 2',
};

import { RequestCreateActionProcessDTO, RequestDetailsDTO } from 'esos-api';

export const processActionsDetailsTypesMap: Partial<Record<RequestDetailsDTO['requestType'], string>> = {
  ORGANISATION_ACCOUNT_OPENING: 'Account Creation',
  NOTIFICATION_OF_COMPLIANCE_P3: 'Notification of Compliance',
  ACTION_PLAN_P3: 'Action Plan',
  ACCOUNT_CLOSURE: 'Account closure',
  PROGRESS_UPDATE_1_P3: 'Progress Update 1',
  PROGRESS_UPDATE_2_P3: 'Progress Update 2',
};

export interface WorkflowLabel {
  title: string;
  button: string;
  type: RequestCreateActionProcessDTO['requestCreateActionType'];
  errors: string[];
  order: number;
  disaggregatedTriggerPointText?: string;
  showDisaggregatedTriggerPoint?: boolean;
}

export type WorkflowMap = Omit<
  Record<RequestDetailsDTO['requestType'], Partial<WorkflowLabel>>,
  'SYSTEM_MESSAGE_NOTIFICATION'
>;

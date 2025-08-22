import { RequestActionPageContentFactoryMap } from '@common/request-action/request-action.types';
import { accountClosureContent } from '@timeline/account-closure/account-closure-content';
import { actionPlanApplicationSubmitted } from '@timeline/action-plan/action-plan-application-content';
import { notificationApplicationSentToEditContent } from '@timeline/notification/notification-application-content';
import {
  organisationAccountApplicationSubmittedContent,
  organisationAccountDecisionContent,
} from '@timeline/organisation-account-application/organisation-account-application-content';
import { progressUpdate1ApplicationSubmitted } from '@timeline/progress-update-1/pu1-application-content';
import { progressUpdate2ApplicationSubmitted } from '@timeline/progress-update-2/pu2-application-content';

export const timelineContent: RequestActionPageContentFactoryMap = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED: organisationAccountApplicationSubmittedContent,
  ORGANISATION_ACCOUNT_OPENING_APPROVED: organisationAccountDecisionContent,
  ORGANISATION_ACCOUNT_OPENING_REJECTED: organisationAccountDecisionContent,
  ORGANISATION_ACCOUNT_OPENING_CREATED: organisationAccountApplicationSubmittedContent,

  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT: notificationApplicationSentToEditContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED: notificationApplicationSentToEditContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT: notificationApplicationSentToEditContent,

  ACTION_PLAN_P3_APPLICATION_SUBMITTED: actionPlanApplicationSubmitted,

  ACCOUNT_CLOSURE_APPLICATION_SUBMITTED: accountClosureContent,

  PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED: progressUpdate1ApplicationSubmitted,
  PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED: progressUpdate2ApplicationSubmitted,
};

import { RequestTaskPageContentFactoryMap } from '@common/request-task/request-task.types';
import { accountClosureTaskContent } from '@tasks/account-closure/account-closure-task-content';
import { actionPlanTaskContent } from '@tasks/action-plan/action-plan-task-content';
import { notificationTaskContent, waitForEditTaskContent } from '@tasks/notification/notification-task-content';
import { organisationAccountApplicationReviewTaskContent } from '@tasks/organisation-account-application-review/organisation-account-application-review-task-content';
import { progressUpdate1TaskContent } from '@tasks/progress-update-1/progress-update-1-task-content';
import { progressUpdate2TaskContent } from '@tasks/progress-update-2/progress-update-2-task-content';

export const tasksContent: RequestTaskPageContentFactoryMap = {
  ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW: organisationAccountApplicationReviewTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT: notificationTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT: notificationTaskContent,
  NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT: waitForEditTaskContent,
  ACTION_PLAN_P3_APPLICATION_SUBMIT: actionPlanTaskContent,
  ACCOUNT_CLOSURE_SUBMIT: accountClosureTaskContent,
  PROGRESS_UPDATE_1_P3_APPLICATION_SUBMIT: progressUpdate1TaskContent,
  PROGRESS_UPDATE_2_P3_APPLICATION_SUBMIT: progressUpdate2TaskContent,
};

import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { isWizardCompleted } from '@tasks/notification/subtasks/compliance-periods/compliance-periods.wizard';
import { WizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

export const canActivateCompliancePeriods: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  return isEditable || createUrlTreeFromSnapshot(route, [WizardStep.SUMMARY]);
};

export const canActivateCompliancePeriodsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const subtask = inject(COMPLIANCE_PERIOD_SUB_TASK);

  const compliancePeriod =
    subtask === CompliancePeriodSubtask.FIRST
      ? store.select(notificationQuery.selectFirstCompliancePeriod)()
      : store.select(notificationQuery.selectSecondCompliancePeriod)();

  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const wizardCompleted = isWizardCompleted(compliancePeriod);
  return (
    !isEditable ||
    (isEditable && wizardCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', WizardStep.INFORMATION_EXISTS])
  );
};

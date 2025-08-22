import { SideEffect } from '@common/forms/side-effects/side-effect';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { COMPLIANCE_ROUTE_SUB_TASK } from './compliance-route.helper';

export class ComplianceRouteSideEffect extends SideEffect {
  override subtask = COMPLIANCE_ROUTE_SUB_TASK;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const twelveMonthsVerifiableDataUsed = payload?.noc?.complianceRoute?.areTwelveMonthsVerifiableDataUsed;
      const energyConsumptionProfilingUsed = payload?.noc?.complianceRoute?.energyConsumptionProfilingUsed;
      const partsProhibitedFromDisclosingExist = payload?.noc?.complianceRoute?.partsProhibitedFromDisclosingExist;

      if (twelveMonthsVerifiableDataUsed === true) {
        delete payload?.noc?.complianceRoute?.twelveMonthsVerifiableDataUsedReason;
      }

      if (energyConsumptionProfilingUsed === 'YES') {
        delete payload?.noc?.complianceRoute?.isEnergyConsumptionProfilingNotUsedRecorded;
      } else if (['NO', 'NOT_APPLICABLE'].includes(energyConsumptionProfilingUsed)) {
        delete payload?.noc?.complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded;
      }

      if (partsProhibitedFromDisclosingExist === false) {
        delete payload?.noc?.complianceRoute?.partsProhibitedFromDisclosing;
        delete payload?.noc?.complianceRoute?.partsProhibitedFromDisclosingReason;
      }
    });
  }
}

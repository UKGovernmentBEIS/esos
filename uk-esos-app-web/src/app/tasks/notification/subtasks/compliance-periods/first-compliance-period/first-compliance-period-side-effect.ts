import { SideEffect } from '@common/forms/side-effects/side-effect';
import { SUB_TASK_FIRST_COMPLIANCE_PERIOD } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class FirstCompliancePeriodSideEffect extends SideEffect {
  override subtask = SUB_TASK_FIRST_COMPLIANCE_PERIOD;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const informationExists = payload?.noc?.firstCompliancePeriod.informationExists;
      if (['NO', 'SKIP_QUESTION'].includes(informationExists)) {
        delete payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails;
      } else if (informationExists && payload?.noc?.firstCompliancePeriod?.firstCompliancePeriodDetails == null) {
        payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails = {
          organisationalEnergyConsumption: null,
          organisationalEnergyConsumptionBreakdown: {
            buildings: null,
            industrialProcesses: null,
            transport: null,
            otherProcesses: null,
            total: null,
          },
          potentialReduction: {
            buildings: null,
            industrialProcesses: null,
            transport: null,
            otherProcesses: null,
            total: null,
          },
          significantEnergyConsumption: {
            buildings: null,
            industrialProcesses: null,
            transport: null,
            otherProcesses: null,
            total: null,
            significantEnergyConsumptionPct: null,
          },
          explanation: null,
        };
      }
    });
  }
}

import { SideEffect } from '@common/forms/side-effects/side-effect';
import { determineReportingObligationCategory } from '@requests/common/reporting-obligation-category';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

import { reportingObligationTypesForDisplaySecondResponsibleOfficer } from '../confirmation/confirmation.helper';
import { LEAD_ASSESSOR_DETAILS_SUB_TASK } from './lead-assessor-details.helper';

export class LeadAssessorDetailsSideEffect extends SideEffect {
  override subtask = LEAD_ASSESSOR_DETAILS_SUB_TASK;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const leadAssessorType = payload?.noc?.leadAssessor?.leadAssessorType;
      const reportingObligationCategory = determineReportingObligationCategory(payload?.noc?.reportingObligation);

      if (leadAssessorType === 'EXTERNAL') {
        delete payload?.noc?.confirmations?.secondResponsibleOfficerEnergyTypes;
        delete payload?.noc?.confirmations?.secondResponsibleOfficerDetails;
      } else {
        payload.nocSectionsCompleted.confirmations =
          !payload?.noc?.confirmations?.secondResponsibleOfficerEnergyTypes &&
          !payload?.noc?.confirmations?.secondResponsibleOfficerDetails &&
          payload.nocSectionsCompleted.confirmations === 'COMPLETED' &&
          reportingObligationTypesForDisplaySecondResponsibleOfficer.includes(reportingObligationCategory)
            ? 'IN_PROGRESS'
            : payload.nocSectionsCompleted.confirmations;
      }
    });
  }
}

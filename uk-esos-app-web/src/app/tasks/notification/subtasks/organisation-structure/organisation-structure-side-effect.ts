import { SideEffect } from '@common/forms/side-effects/side-effect';
import { ORGANISATION_STRUCTURE_SUB_TASK } from '@tasks/notification/subtasks/organisation-structure/organisation-structure.helper';
import produce from 'immer';

import { NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class OrganisationStructureSideEffect extends SideEffect {
  override subtask = ORGANISATION_STRUCTURE_SUB_TASK;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const organisationStructure = payload?.noc?.organisationStructure;

      if (organisationStructure?.isNonComplyingUndertakingsIncluded === false) {
        delete payload?.noc?.organisationStructure?.organisationUndertakingDetails;
      }
    });
  }
}

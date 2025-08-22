import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createAggregateSelector, createDescendingSelector, StateSelector } from '@common/store';
import { isNocCompleted } from '@tasks/notification/notification-task-content';
import { TaskItemStatus } from '@tasks/task-item-status';

import {
  AccountOriginatedData,
  AlternativeComplianceRoutes,
  AssessmentPersonnel,
  ComplianceRoute,
  Confirmations,
  ContactPersons,
  EnergyConsumptionDetails,
  EnergySavingsAchieved,
  EnergySavingsOpportunities,
  FirstCompliancePeriod,
  LeadAssessor,
  NocP3,
  OrganisationStructure,
  ReportingObligation,
  ResponsibleUndertaking,
  SecondCompliancePeriod,
} from 'esos-api';

import { determineReportingObligationCategory } from '../../../requests/common/reporting-obligation-category';
import { ReportingObligationCategory } from '../../../requests/common/reporting-obligation-category.types';
import { NotificationTaskPayload } from '../notification.types';

const selectPayload: StateSelector<RequestTaskState, NotificationTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as NotificationTaskPayload,
);

const selectNocAttachments: StateSelector<RequestTaskState, { [key: string]: string }> = createDescendingSelector(
  selectPayload,
  (payload) => payload.nocAttachments,
);

const selectFirstCompliancePeriod: StateSelector<RequestTaskState, FirstCompliancePeriod> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.firstCompliancePeriod,
);

const selectSecondCompliancePeriod: StateSelector<RequestTaskState, SecondCompliancePeriod> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.secondCompliancePeriod,
);

const selectNocSectionsCompleted: StateSelector<RequestTaskState, NotificationTaskPayload['nocSectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload.nocSectionsCompleted);

const selectStatusForSubtask = (subtask: keyof NocP3): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    selectNocSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED,
  );
};

const selectCanSubmitNoc: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  isNocCompleted,
);

const selectReportingObligation: StateSelector<RequestTaskState, ReportingObligation> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.reportingObligation,
);

const selectLastReportingObligationCategory: StateSelector<RequestTaskState, ReportingObligationCategory> =
  createDescendingSelector(
    requestTaskQuery.selectMetadata,
    (metadata) => metadata?.lastReportingObligationCategory as ReportingObligationCategory,
  );

const selectReportingObligationCategory: StateSelector<RequestTaskState, ReportingObligationCategory> =
  createAggregateSelector(
    selectReportingObligation,
    selectLastReportingObligationCategory,
    selectStatusForSubtask('reportingObligation'),
    (reportingObligation, lastReportingObligationCategory, status) => {
      return status === 'COMPLETED'
        ? determineReportingObligationCategory(reportingObligation)
        : lastReportingObligationCategory;
    },
  );

const selectAssessmentPersonnel: StateSelector<RequestTaskState, AssessmentPersonnel> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.noc?.assessmentPersonnel,
);

const selectContactPersons: StateSelector<RequestTaskState, ContactPersons> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.contactPersons,
);

const selectComplianceRoute: StateSelector<RequestTaskState, ComplianceRoute> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.complianceRoute,
);

const selectResponsibleUndertaking: StateSelector<RequestTaskState, ResponsibleUndertaking> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.responsibleUndertaking,
);

const selectAlternativeComplianceRoutes: StateSelector<RequestTaskState, AlternativeComplianceRoutes> =
  createDescendingSelector(selectPayload, (payload) => payload.noc?.alternativeComplianceRoutes);

const selectAccountOriginatedData: StateSelector<RequestTaskState, AccountOriginatedData> = createDescendingSelector(
  selectPayload,
  (payload) => payload.accountOriginatedData,
);

const selectEnergySavingsAchieved: StateSelector<RequestTaskState, EnergySavingsAchieved> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.energySavingsAchieved,
);

const selectLeadAssessor: StateSelector<RequestTaskState, LeadAssessor> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.noc?.leadAssessor,
);

const selectOrganisationStructure: StateSelector<RequestTaskState, OrganisationStructure> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.organisationStructure,
);

const selectEnergyConsumption: StateSelector<RequestTaskState, EnergyConsumptionDetails> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.noc?.energyConsumptionDetails,
);

const selectEnergySavingsOpportunities: StateSelector<RequestTaskState, EnergySavingsOpportunities> =
  createDescendingSelector(selectPayload, (payload) => {
    return payload.noc?.energySavingsOpportunities;
  });

const selectConfirmation: StateSelector<RequestTaskState, Confirmations> = createDescendingSelector(
  selectPayload,
  (payload) => payload.noc?.confirmations,
);

export const notificationQuery = {
  selectPayload,
  selectNocAttachments,
  selectNocSectionsCompleted,
  selectStatusForSubtask,
  selectCanSubmitNoc,
  selectReportingObligation,
  selectLastReportingObligationCategory,
  selectReportingObligationCategory,
  selectAccountOriginatedData,
  selectAssessmentPersonnel,
  selectContactPersons,
  selectFirstCompliancePeriod,
  selectSecondCompliancePeriod,
  selectResponsibleUndertaking,
  selectAlternativeComplianceRoutes,
  selectEnergySavingsAchieved,
  selectLeadAssessor,
  selectOrganisationStructure,
  selectEnergyConsumption,
  selectEnergySavingsOpportunities,
  selectComplianceRoute,
  selectConfirmation,
};

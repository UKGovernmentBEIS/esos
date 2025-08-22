import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, createSelector, StateSelector } from '@common/store';
import { NotificationApplicationTimelinePayload } from '@timeline/notification/+state/notification-application.types';

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
  RequestActionDTO,
  ResponsibleUndertaking,
  SecondCompliancePeriod,
} from 'esos-api';

const selectAction: StateSelector<RequestActionState, RequestActionDTO> = createSelector(
  requestActionQuery.selectAction,
);

const selectPayload: StateSelector<RequestActionState, NotificationApplicationTimelinePayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (state) => state as NotificationApplicationTimelinePayload,
  );

const selectAccountOriginatedData: StateSelector<RequestActionState, AccountOriginatedData> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.accountOriginatedData,
);

const selectNoc: StateSelector<RequestActionState, NocP3> = createDescendingSelector(
  selectPayload,
  (state) => state?.noc,
);

const selectReportingObligation: StateSelector<RequestActionState, ReportingObligation> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.reportingObligation,
);

const selectResponsibleUndertaking: StateSelector<RequestActionState, ResponsibleUndertaking> =
  createDescendingSelector(selectNoc, (noc) => noc?.responsibleUndertaking);

const selectContactPersons: StateSelector<RequestActionState, ContactPersons> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.contactPersons,
);

const selectOrganisationStructure: StateSelector<RequestActionState, OrganisationStructure> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.organisationStructure,
);

const selectComplianceRoute: StateSelector<RequestActionState, ComplianceRoute> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.complianceRoute,
);

const selectEnergyConsumptionDetails: StateSelector<RequestActionState, EnergyConsumptionDetails> =
  createDescendingSelector(selectNoc, (noc) => noc?.energyConsumptionDetails);

const selectEnergySavingsOpportunities: StateSelector<RequestActionState, EnergySavingsOpportunities> =
  createDescendingSelector(selectNoc, (noc) => noc?.energySavingsOpportunities);

const selectAlternativeComplianceRoutes: StateSelector<RequestActionState, AlternativeComplianceRoutes> =
  createDescendingSelector(selectNoc, (noc) => noc?.alternativeComplianceRoutes);

const selectEnergySavingsAchieved: StateSelector<RequestActionState, EnergySavingsAchieved> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.energySavingsAchieved,
);

const selectLeadAssessor: StateSelector<RequestActionState, LeadAssessor> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.leadAssessor,
);

const selectAssessmentPersonnel: StateSelector<RequestActionState, AssessmentPersonnel> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.assessmentPersonnel,
);

const selectFirstCompliancePeriod: StateSelector<RequestActionState, FirstCompliancePeriod> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.firstCompliancePeriod,
);

const selectSecondCompliancePeriod: StateSelector<RequestActionState, SecondCompliancePeriod> =
  createDescendingSelector(selectNoc, (noc) => noc?.secondCompliancePeriod);

const selectConfirmations: StateSelector<RequestActionState, Confirmations> = createDescendingSelector(
  selectNoc,
  (noc) => noc?.confirmations,
);

export const notificationApplicationTimelineQuery = {
  selectAction,
  selectPayload,
  selectAccountOriginatedData,
  selectNoc,
  selectReportingObligation,
  selectResponsibleUndertaking,
  selectContactPersons,
  selectOrganisationStructure,
  selectComplianceRoute,
  selectEnergyConsumptionDetails,
  selectEnergySavingsOpportunities,
  selectAlternativeComplianceRoutes,
  selectEnergySavingsAchieved,
  selectLeadAssessor,
  selectAssessmentPersonnel,
  selectFirstCompliancePeriod,
  selectSecondCompliancePeriod,
  selectConfirmations,
};

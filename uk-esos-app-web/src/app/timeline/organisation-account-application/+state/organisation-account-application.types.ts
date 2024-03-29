import {
  OrganisationAccountOpeningApplicationSubmittedRequestActionPayload,
  OrganisationAccountOpeningDecisionSubmittedRequestActionPayload,
} from 'esos-api';

export type OrganisationAccountApplicationTimelinePayload =
  | OrganisationAccountOpeningApplicationSubmittedRequestActionPayload
  | OrganisationAccountOpeningDecisionSubmittedRequestActionPayload;

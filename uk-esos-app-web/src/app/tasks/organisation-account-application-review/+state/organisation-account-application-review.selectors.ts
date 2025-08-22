import { requestTaskQuery, RequestTaskState } from '@common/request-task/+state';
import { createDescendingSelector, createSelector, StateSelector } from '@common/store';

import { CountyAddressDTO, OrganisationAccountDTO } from 'esos-api';

const selectPayload: StateSelector<RequestTaskState, any> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as any,
);

const selectName: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload.account.name,
);

const selectCompetentAuthority: StateSelector<RequestTaskState, OrganisationAccountDTO['competentAuthority']> =
  createDescendingSelector(selectPayload, (payload) => payload.account.competentAuthority);

const selectAddress: StateSelector<RequestTaskState, CountyAddressDTO> = createDescendingSelector(
  selectPayload,
  (payload) => {
    const account = payload.account;
    return {
      line1: account.line1,
      line2: account.line2,
      city: account.city,
      county: account.county,
      postcode: account.postcode,
    };
  },
);

const selectRegistrationNumber: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload.account.registrationNumber,
);

const selectRegistrationStatus: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => !!payload.account.registrationNumber,
);

const selectType: StateSelector<RequestTaskState, OrganisationAccountDTO['type']> = createDescendingSelector(
  selectPayload,
  (payload) => payload.account.type,
);

const selectOtherTypeName: StateSelector<RequestTaskState, OrganisationAccountDTO['otherTypeName']> =
  createDescendingSelector(selectPayload, (payload) => payload.account.otherTypeName);

const selectCodes: StateSelector<RequestTaskState, OrganisationAccountDTO['codes']> = createDescendingSelector(
  selectPayload,
  (payload) => payload.account.codes,
);

const selectIsEditable: StateSelector<RequestTaskState, boolean> = createSelector((state) => state?.isEditable);

export const organisationAccountReviewQuery = {
  selectPayload,
  selectName,
  selectCompetentAuthority,
  selectAddress,
  selectRegistrationNumber,
  selectRegistrationStatus,
  selectType,
  selectOtherTypeName,
  selectCodes,
  selectIsEditable,
};

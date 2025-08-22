import { RequestActionDTO } from 'esos-api';

import { ItemActionHeaderPipe } from './item-action-header.pipe';

describe('ItemActionHeaderPipe', () => {
  let pipe: ItemActionHeaderPipe;

  const baseRequestAction: Omit<RequestActionDTO, 'type'> = {
    id: 1,
    payload: {},
    submitter: 'John Bolt',
    creationDate: '2021-03-29T12:26:36.000Z',
  };

  beforeAll(() => (pipe = new ItemActionHeaderPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the organisation accounts', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Original application submitted by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_APPROVED',
      }),
    ).toEqual('Organisation account approved by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_REJECTED',
      }),
    ).toEqual('Organisation account rejected by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ORGANISATION_ACCOUNT_OPENING_CREATED',
      }),
    ).toEqual('Original application created by John Bolt');
  });

  it('should return the notifications', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT',
      }),
    ).toEqual('Notification sent for review by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT',
      }),
    ).toEqual('Notification returned by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RE_INITIATED',
      }),
    ).toEqual('Notification returned for changes by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Notification submitted by John Bolt');
  });

  it('should return the payments', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_MARKED_AS_PAID',
      }),
    ).toEqual('Payment marked as paid by John Bolt (BACS)');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_CANCELLED',
      }),
    ).toEqual('Payment task cancelled by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_MARKED_AS_RECEIVED',
      }),
    ).toEqual('Payment marked as received by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PAYMENT_COMPLETED',
      }),
    ).toEqual('Payment confirmed via GOV.UK pay');
  });

  it('should return the Action Plan', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ACTION_PLAN_P3_APPLICATION_RE_INITIATED',
      }),
    ).toEqual('Action Plan returned for changes by John Bolt');
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ACTION_PLAN_P3_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Action Plan submitted by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ACTION_PLAN_APPLICATION_CANCELLED',
      }),
    ).toEqual('Action Plan cancelled by John Bolt');
  });

  it('should return the Account Closure', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ACCOUNT_CLOSURE_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Account closed by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'ACCOUNT_CLOSURE_APPLICATION_CANCELLED',
      }),
    ).toEqual('Account closure task cancelled by John Bolt');
  });

  it('should return Progress Update 1', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_1_P3_APPLICATION_RE_INITIATED',
      }),
    ).toEqual('Progress Update 1 returned for changes by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Progress Update 1 submitted by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_1_APPLICATION_CANCELLED',
      }),
    ).toEqual('Progress Update 1 cancelled by John Bolt');
  });

  it('should return Progress Update 2', () => {
    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED',
      }),
    ).toEqual('Progress Update 2 returned for changes by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED',
      }),
    ).toEqual('Progress Update 2 submitted by John Bolt');

    expect(
      pipe.transform({
        ...baseRequestAction,
        type: 'PROGRESS_UPDATE_2_APPLICATION_CANCELLED',
      }),
    ).toEqual('Progress Update 2 cancelled by John Bolt');
  });

  it('should display the approved application title', () => {
    expect(pipe.transform({})).toEqual('Approved Application');
  });
});

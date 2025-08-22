import { RequestActionInfoDTO } from 'esos-api';

import { TimelineItemLinkPipe } from './timeline-item-link.pipe';

describe('TimelineItemLinkPipe', () => {
  let pipe: TimelineItemLinkPipe;

  const requestAction: RequestActionInfoDTO = {
    id: 1,
    submitter: 'John Bolt',
    creationDate: '2021-03-29T12:26:36.000Z',
  };

  beforeAll(() => (pipe = new TimelineItemLinkPipe()));

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty link', () => {
    const noLinkActionTypes: RequestActionInfoDTO['type'][] = [
      'RDE_ACCEPTED',
      'RDE_CANCELLED',
      'RDE_EXPIRED',

      'RFI_CANCELLED',
      'RFI_EXPIRED',

      'REQUEST_TERMINATED',

      'VERIFICATION_STATEMENT_CANCELLED',
    ];

    noLinkActionTypes.forEach((type) => {
      requestAction.type = type;
      expect(pipe.transform(requestAction)).toBeNull();
    });
  });

  it('should return link for organisation account submitted', () => {
    requestAction.type = 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction)).toEqual(['/timeline', requestAction.id]);
  });

  it('should return link for organisation account created', () => {
    requestAction.type = 'ORGANISATION_ACCOUNT_OPENING_CREATED';
    expect(pipe.transform(requestAction)).toEqual(['/timeline', requestAction.id]);
  });

  it('should return link for payment', () => {
    requestAction.type = 'PAYMENT_MARKED_AS_PAID';
    expect(pipe.transform(requestAction)).toEqual(['/payment', 'actions', requestAction.id, 'paid']);

    requestAction.type = 'PAYMENT_CANCELLED';
    expect(pipe.transform(requestAction)).toEqual(['/payment', 'actions', requestAction.id, 'cancelled']);

    requestAction.type = 'PAYMENT_MARKED_AS_RECEIVED';
    expect(pipe.transform(requestAction)).toEqual(['/payment', 'actions', requestAction.id, 'received']);

    requestAction.type = 'PAYMENT_COMPLETED';
    expect(pipe.transform(requestAction)).toEqual(['/payment', 'actions', requestAction.id, 'completed']);
  });

  it('should return link for rfi', () => {
    requestAction.type = 'RFI_SUBMITTED';
    expect(pipe.transform(requestAction, false)).toEqual(['/rfi', 'action', requestAction.id, 'rfi-submitted']);

    requestAction.type = 'RFI_RESPONSE_SUBMITTED';
    expect(pipe.transform(requestAction, false)).toEqual([
      '/rfi',
      'action',
      requestAction.id,
      'rfi-response-submitted',
    ]);
  });

  it('should return link for rde', () => {
    requestAction.type = 'RDE_SUBMITTED';
    expect(pipe.transform(requestAction, false)).toEqual(['/rde', 'action', requestAction.id, 'rde-submitted']);

    requestAction.type = 'RDE_REJECTED';
    expect(pipe.transform(requestAction, false)).toEqual([
      '/rde',
      'action',
      requestAction.id,
      'rde-response-submitted',
    ]);

    requestAction.type = 'RDE_FORCE_ACCEPTED';
    expect(pipe.transform(requestAction, false)).toEqual([
      '/rde',
      'action',
      requestAction.id,
      'rde-manual-approval-submitted',
    ]);

    requestAction.type = 'RDE_FORCE_REJECTED';
    expect(pipe.transform(requestAction, false)).toEqual([
      '/rde',
      'action',
      requestAction.id,
      'rde-manual-approval-submitted',
    ]);
  });

  it('should return link for noc', () => {
    requestAction.type = 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RE_INITIATED';
    expect(pipe.transform(requestAction, true)).toEqual(null);
  });

  it('should return link for Action Plan', () => {
    requestAction.type = 'ACTION_PLAN_P3_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'ACTION_PLAN_P3_APPLICATION_RE_INITIATED';
    expect(pipe.transform(requestAction, true)).toEqual(null);

    requestAction.type = 'ACTION_PLAN_APPLICATION_CANCELLED';
    expect(pipe.transform(requestAction, true)).toEqual(null);
  });

  it('should return link for Account closure', () => {
    requestAction.type = 'ACCOUNT_CLOSURE_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'ACCOUNT_CLOSURE_APPLICATION_CANCELLED';
    expect(pipe.transform(requestAction, true)).toEqual(null);
  });

  it('should return link for Progress Update 1', () => {
    requestAction.type = 'PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'PROGRESS_UPDATE_1_P3_APPLICATION_RE_INITIATED';
    expect(pipe.transform(requestAction, true)).toEqual(null);

    requestAction.type = 'PROGRESS_UPDATE_1_APPLICATION_CANCELLED';
    expect(pipe.transform(requestAction, true)).toEqual(null);
  });

  it('should return link for Progress Update 2', () => {
    requestAction.type = 'PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED';
    expect(pipe.transform(requestAction, true)).toEqual(['./timeline', requestAction.id]);

    requestAction.type = 'PROGRESS_UPDATE_2_P3_APPLICATION_RE_INITIATED';
    expect(pipe.transform(requestAction, true)).toEqual(null);

    requestAction.type = 'PROGRESS_UPDATE_2_APPLICATION_CANCELLED';
    expect(pipe.transform(requestAction, true)).toEqual(null);
  });
});

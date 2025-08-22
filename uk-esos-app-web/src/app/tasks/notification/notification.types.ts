import {
  NotificationOfComplianceP3ApplicationEditRequestTaskPayload,
  NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
} from 'esos-api';

export type NotificationTaskPayload =
  | NotificationOfComplianceP3ApplicationEditRequestTaskPayload
  | NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

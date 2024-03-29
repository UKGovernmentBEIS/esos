/**
 * ESOS API Documentation
 * ESOS API Documentation
 *
 * The version of the OpenAPI document: uk-esos-app-api 0.81.0-SNAPSHOT
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RequestTaskPayload } from './requestTaskPayload';

export interface RequestTaskDTO {
  id?: number;
  type?:
    | 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT'
    | 'NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT';
  payload?: RequestTaskPayload;
  assignable?: boolean;
  assigneeUserId?: string;
  assigneeFullName?: string;
  daysRemaining?: number;
  startDate?: string;
}

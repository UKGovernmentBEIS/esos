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
import { AccountOriginatedData } from './accountOriginatedData';
import { NocP3 } from './nocP3';
import { RequestTaskPayload } from './requestTaskPayload';

export interface NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload extends RequestTaskPayload {
  noc?: NocP3;
  accountOriginatedData?: AccountOriginatedData;
  nocSectionsCompleted?: { [key: string]: string };
  nocAttachments?: { [key: string]: string };
}

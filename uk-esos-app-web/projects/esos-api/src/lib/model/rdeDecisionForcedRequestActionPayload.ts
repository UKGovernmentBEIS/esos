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
import { RdeForceDecisionPayload } from './rdeForceDecisionPayload';
import { RequestActionPayload } from './requestActionPayload';

export interface RdeDecisionForcedRequestActionPayload extends RequestActionPayload {
  rdeForceDecisionPayload: RdeForceDecisionPayload;
  rdeAttachments?: { [key: string]: string };
}

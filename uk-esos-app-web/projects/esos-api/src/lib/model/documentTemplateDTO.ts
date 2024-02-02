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
import { TemplateInfoDTO } from './templateInfoDTO';

export interface DocumentTemplateDTO {
  id?: number;
  name?: string;
  workflow?: string;
  lastUpdatedDate?: string;
  fileUuid?: string;
  filename?: string;
  notificationTemplates?: Array<TemplateInfoDTO>;
}

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
import { OrganisationContactDetails } from './organisationContactDetails';
import { OverseasParentDetails } from './overseasParentDetails';
import { ReviewOrganisationDetails } from './reviewOrganisationDetails';
import { TradingDetails } from './tradingDetails';

export interface ResponsibleUndertaking {
  organisationDetails: ReviewOrganisationDetails;
  tradingDetails: TradingDetails;
  organisationContactDetails: OrganisationContactDetails;
  hasOverseasParentDetails: boolean;
  overseasParentDetails?: OverseasParentDetails;
}

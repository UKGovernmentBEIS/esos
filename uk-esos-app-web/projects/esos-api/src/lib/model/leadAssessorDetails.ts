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

export interface LeadAssessorDetails {
  firstName: string;
  lastName: string;
  email: string;
  professionalBody:
    | 'ASSOCIATION_OF_ENERGY_ENGINEERS'
    | 'CIBSE_THE_CHARTERED_INSTITUTION_OF_BUILDING_SERVICES_ENGINEERS'
    | 'ELMHURST_ENERGY_SYSTEMS'
    | 'ENERGY_INSTITUTE'
    | 'ENERGY_MANAGERS_ASSOCIATION'
    | 'INSTITUTION_OF_CHEMICAL_ENGINEERS'
    | 'INSTITUTE_OF_ENVIRONMENTAL_MANAGEMENT_AND_ASSESSMENT'
    | 'QUIDOS'
    | 'STROMA_CERTIFICATION_LTD';
  membershipNumber: string;
}

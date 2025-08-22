import { ReportingObligationCategory } from '@requests/common/reporting-obligation-category.types';

import { ContactPerson } from 'esos-api';

import { ContactPersonNew } from './contact-persons.type';

export const CONFIRMATIONS_SUB_TASK = 'confirmations';

export enum CurrentStep {
  NO_ENERGY_ASSESSMENT_TYPES = 'no-energy-responsibility-assessment-types',
  ASSESSMENT_TYPES = 'responsibility-assessment-types',
  OFFICER_DETAILS = 'responsible-officer-details',
  ASSESSMENT_DATE = 'review-assessment-date',
  SECOND_OFFICER_TYPES = 'second-responsible-officer-energy-types',
  SECOND_OFFICER_DETAILS = 'second-responsible-officer-details',
  SUMMARY = 'summary',
}

export enum WizardStep {
  STEP_NO_ENERGY_ASSESSMENT_TYPES = 'no-energy-responsibility-assessment-types',
  STEP_ASSESSMENT_TYPES = 'responsibility-assessment-types',
  STEP_OFFICER_DETAILS = 'responsible-officer-details',
  STEP_ASSESSMENT_DATE = 'review-assessment-date',
  STEP_SECOND_OFFICER_TYPES = 'second-responsible-officer-energy-types',
  STEP_SECOND_OFFICER_DETAILS = 'second-responsible-officer-details',
  STEP_SUMMARY = '../',
}

export const addAddressProperty = (contactPerson: ContactPerson): ContactPersonNew => {
  const { line1, line2, city, county, postcode } = contactPerson;

  return {
    ...contactPerson,
    address: {
      line1,
      line2,
      city,
      county,
      postcode,
    },
  };
};

export const removeAddressProperty = (contactPerson: ContactPersonNew): ContactPerson => {
  const { address, ...contactPersonNew } = contactPerson;

  return {
    ...contactPersonNew,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    county: address.county,
    postcode: address.postcode,
  };
};

export const reviewAssessmentCannotBeBefore = new Date('2019-12-05');

export const reportingObligationTypesForDisplaySecondResponsibleOfficer: Array<ReportingObligationCategory> = [
  'ESOS_ENERGY_ASSESSMENTS_95_TO_100',
  'PARTIAL_ENERGY_ASSESSMENTS',
  'LESS_THAN_40000_KWH_PER_YEAR',
  'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100',
];

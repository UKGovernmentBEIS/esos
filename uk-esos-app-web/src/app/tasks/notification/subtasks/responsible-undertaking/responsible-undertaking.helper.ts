export const RESPONSIBLE_UNDERTAKING_SUB_TASK = 'responsibleUndertaking';

export enum ResponsibleUndertakingCurrentStep {
  REGISTRATION_NUMBER = 'registrationNumber',
  ORGANISATION_DETAILS = 'organisationDetails',
  TRADING_DETAILS = 'tradingDetails',
  ORGANISATION_CONTACT_DETAILS = 'organisationContactDetails',
  NOTIFICATION = 'notification',
  HAS_OVERSEAS_PARENT_DETAILS = 'hasOverseasParentDetails',
  OVERSEAS_PARENT_DETAILS = 'overseasParentDetails',
  SUMMARY = 'summary',
}

export enum ResponsibleUndertakingWizardStep {
  REGISTRATION_NUMBER = 'organisation-registration-number',
  ORGANISATION_DETAILS = 'organisation-details',
  TRADING_DETAILS = 'trading-details',
  ORGANISATION_CONTACT_DETAILS = 'organisation-contact-details',
  NOTIFICATION = 'notification',
  HAS_OVERSEAS_PARENT_DETAILS = 'overseas-parent-details-question',
  OVERSEAS_PARENT_DETAILS = 'overseas-parent-details',
  SUMMARY = '../',
}

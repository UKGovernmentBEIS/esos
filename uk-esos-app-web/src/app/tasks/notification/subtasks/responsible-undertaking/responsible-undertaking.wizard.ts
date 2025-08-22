import { ResponsibleUndertaking } from 'esos-api';

export const isWizardCompleted = (responsibleUndertaking?: ResponsibleUndertaking) => {
  const {
    organisationDetails,
    tradingDetails,
    organisationContactDetails,
    isBehalfOfTrust,
    hasOverseasParentDetails,
    overseasParentDetails,
  } = responsibleUndertaking ?? {};

  const isRegistationNumberCompleted = organisationDetails?.registrationNumberExist != null;

  const isOrganisationDetailsCompleted =
    !!organisationDetails?.name &&
    !!organisationDetails?.line1 &&
    !!organisationDetails?.city &&
    !!organisationDetails?.postcode;

  const isTradingDetailsCompleted =
    tradingDetails?.exist === false || (tradingDetails?.exist === true && !!tradingDetails?.tradingName);

  const isOrganisationContactDetailsCompleted =
    !!organisationContactDetails?.email && !!organisationContactDetails?.phoneNumber;

  const isNotificationCompleted = isBehalfOfTrust != null;

  const isOverseasParentDetailsCompleted = !!overseasParentDetails?.name;

  return (
    isRegistationNumberCompleted &&
    isOrganisationDetailsCompleted &&
    isTradingDetailsCompleted &&
    isOrganisationContactDetailsCompleted &&
    isNotificationCompleted &&
    (hasOverseasParentDetails
      ? hasOverseasParentDetails && isOverseasParentDetailsCompleted
      : hasOverseasParentDetails !== undefined)
  );
};

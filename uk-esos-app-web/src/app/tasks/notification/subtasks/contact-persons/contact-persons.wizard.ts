import { ContactPersons } from 'esos-api';

export const isWizardCompleted = (contactPersons: ContactPersons) => {
  const { primaryContact, hasSecondaryContact, secondaryContact } = contactPersons ?? {};

  const isPrimaryContactCompleted =
    !!primaryContact?.firstName &&
    !!primaryContact?.lastName &&
    !!primaryContact?.email &&
    !!primaryContact?.line1 &&
    !!primaryContact?.city &&
    !!primaryContact?.postcode;

  const isSecondaryContactCompleted =
    !!secondaryContact?.firstName &&
    !!secondaryContact?.lastName &&
    !!secondaryContact?.email &&
    !!secondaryContact?.line1 &&
    !!secondaryContact?.city &&
    !!secondaryContact?.postcode;

  return (
    isPrimaryContactCompleted &&
    (hasSecondaryContact ? hasSecondaryContact && isSecondaryContactCompleted : hasSecondaryContact !== undefined)
  );
};

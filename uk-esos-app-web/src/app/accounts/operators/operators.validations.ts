import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { GovukSelectOption, GovukValidators } from 'govuk-components';

import { AccountOperatorAuthorityUpdateDTO, UserAuthorityInfoDTO } from 'esos-api';

import { ContactType } from './operators.interface';

export const contactTypeOptions: GovukSelectOption<ContactType>[] = [
  { text: null, value: null },
  { text: 'Primary contact', value: 'PRIMARY' },
  { text: 'Secondary contact', value: 'SECONDARY' },
];

export const getContactTypeText = (contactType: ContactType) => {
  return contactTypeOptions.find((type) => type.value === contactType).text;
};

export const activeOperatorAdminValidator = (message: string): ValidatorFn => {
  return GovukValidators.builder(message, (group: UntypedFormGroup) =>
    (group.get('usersArray').value as Array<AccountOperatorAuthorityUpdateDTO>).find(
      (item) => item?.roleCode === 'operator_admin' && item.authorityStatus === 'ACTIVE',
    )
      ? null
      : { noActiveOperatorAdmin: true },
  );
};

export const primaryContactValidator = (): ValidatorFn => {
  return GovukValidators.builder('You must have a primary contact on your account', (group: UntypedFormGroup) =>
    (group.get('usersArray').value as Array<UserAuthorityInfoDTO & { contactType: string }>).find(
      (item) => item.contactType === 'PRIMARY',
    )
      ? null
      : { ['primaryNotActive']: true },
  );
};

export const activeContactValidator = (contactType: ContactType): ValidatorFn => {
  return GovukValidators.builder(
    `You must have a ${contactType.toLowerCase()} contact on your account`,
    (group: UntypedFormGroup) =>
      (group.get('usersArray').value as Array<UserAuthorityInfoDTO & { contactType: string }>).find(
        (item) => item.authorityStatus !== 'ACTIVE' && item.contactType === contactType,
      )
        ? { [`${contactType.toLowerCase()}NotActive`]: true }
        : null,
  );
};

export const uniqueContactType = (contactType: ContactType) => {
  return GovukValidators.builder(`${getContactTypeText(contactType)} must be unique`, (group: UntypedFormGroup) =>
    (group.get('usersArray').value as Array<UserAuthorityInfoDTO & { contactType: string }>).filter(
      (item) => item.contactType === contactType,
    ).length > 1
      ? { [`${contactType.toLowerCase()}IsNotUnique`]: true }
      : null,
  );
};

export const restrictedUserContactValidator = (contactType: ContactType): ValidatorFn => {
  return GovukValidators.builder(
    `You cannot assign a Restricted user as ${contactType.toLowerCase()} contact on your account`,
    (group: UntypedFormGroup) =>
      (group.get('usersArray').value as Array<UserAuthorityInfoDTO & { contactType: string }>).find(
        (item) => item?.roleCode === 'operator' && item.contactType === contactType,
      )
        ? { [`${contactType.toLowerCase()}RestrictedUser`]: true }
        : null,
  );
};

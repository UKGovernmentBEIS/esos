import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { phoneInputValidators } from '@shared/phone-input/phone-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ContactPerson } from 'esos-api';

import { addAddressProperty } from '../contact-persons.helper';

export const secondaryContactDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const existingSecondaryContact = store.select(notificationQuery.selectAccountOriginatedData)().secondaryContact;

    const secondaryContact = addAddressProperty(
      store.select(notificationQuery.selectContactPersons)().secondaryContact ??
        existingSecondaryContact ??
        ({} as ContactPerson),
    );

    return fb.group({
      firstName: [
        secondaryContact?.firstName,
        [
          GovukValidators.required('Enter first name'),
          GovukValidators.maxLength(255, 'First name should not be larger than 255 characters'),
        ],
      ],
      lastName: [
        secondaryContact?.lastName,
        [
          GovukValidators.required('Enter last name'),
          GovukValidators.maxLength(255, 'Last name should not be larger than 255 characters'),
        ],
      ],
      jobTitle: [
        secondaryContact?.jobTitle,
        [
          GovukValidators.required('Enter job title'),
          GovukValidators.maxLength(255, 'Job title should not be larger than 255 characters'),
        ],
      ],
      phoneNumber: [
        { countryCode: secondaryContact?.phoneNumber?.countryCode, number: secondaryContact?.phoneNumber?.number },
        [GovukValidators.empty('Enter phone number'), ...phoneInputValidators],
      ],
      mobileNumber: [
        { countryCode: secondaryContact?.mobileNumber?.countryCode, number: secondaryContact?.mobileNumber?.number },
        [...phoneInputValidators],
      ],
      email: [
        secondaryContact?.email,
        [
          GovukValidators.required('Enter email address'),
          GovukValidators.maxLength(255, 'Email address should not be larger than 255 characters'),
        ],
      ],
      address: fb.group(CountyAddressInputComponent.controlsFactory(secondaryContact?.address)),
    });
  },
};

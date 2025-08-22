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

export const primaryContactDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const existingPrimaryContact = store.select(notificationQuery.selectAccountOriginatedData)().primaryContact;

    const primaryContact = addAddressProperty(
      store.select(notificationQuery.selectContactPersons)()?.primaryContact ??
        existingPrimaryContact ??
        ({} as ContactPerson),
    );

    return fb.group({
      firstName: [
        primaryContact.firstName,
        [
          GovukValidators.required('Enter first name'),
          GovukValidators.maxLength(255, 'First name should not be larger than 255 characters'),
        ],
      ],
      lastName: [
        primaryContact.lastName,
        [
          GovukValidators.required('Enter last name'),
          GovukValidators.maxLength(255, 'Last name should not be larger than 255 characters'),
        ],
      ],
      jobTitle: [
        primaryContact.jobTitle,
        [GovukValidators.maxLength(255, 'Job title should not be larger than 255 characters')],
      ],
      phoneNumber: [
        { countryCode: primaryContact.phoneNumber.countryCode, number: primaryContact.phoneNumber.number },
        [GovukValidators.empty('Enter phone number'), ...phoneInputValidators],
      ],
      mobileNumber: [
        { countryCode: primaryContact.mobileNumber?.countryCode, number: primaryContact.mobileNumber?.number },
        [...phoneInputValidators],
      ],
      email: [
        primaryContact.email,
        [
          GovukValidators.required('Enter email address'),
          GovukValidators.maxLength(255, 'Email address should not be larger than 255 characters'),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        ],
      ],
      address: fb.group(CountyAddressInputComponent.controlsFactory(primaryContact.address)),
    });
  },
};

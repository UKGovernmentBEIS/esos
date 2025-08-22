import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { phoneInputValidators } from '@shared/phone-input/phone-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ContactPerson } from 'esos-api';

import { addAddressProperty } from '../confirmation.helper';

export const ResponsibleOfficerDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const responsibleOfficerDetails = addAddressProperty(
      store.select(notificationQuery.selectConfirmation)()?.responsibleOfficerDetails ?? ({} as ContactPerson),
    );

    return fb.group({
      firstName: [
        responsibleOfficerDetails?.firstName ?? null,
        [
          GovukValidators.required('Enter first name'),
          GovukValidators.maxLength(255, 'First name should not be larger than 255 characters'),
        ],
      ],
      lastName: [
        responsibleOfficerDetails?.lastName ?? null,
        [
          GovukValidators.required('Enter last name'),
          GovukValidators.maxLength(255, 'Last name should not be larger than 255 characters'),
        ],
      ],
      jobTitle: [
        responsibleOfficerDetails?.jobTitle ?? null,
        [
          GovukValidators.required('Enter job title'),
          GovukValidators.maxLength(255, 'Job title should not be larger than 255 characters'),
        ],
      ],
      phoneNumber: [
        {
          countryCode: responsibleOfficerDetails?.phoneNumber?.countryCode,
          number: responsibleOfficerDetails?.phoneNumber?.number,
        },
        [GovukValidators.empty('Enter phone number'), ...phoneInputValidators],
      ],
      mobileNumber: [
        {
          countryCode: responsibleOfficerDetails?.mobileNumber?.countryCode,
          number: responsibleOfficerDetails?.mobileNumber?.number,
        },
        [...phoneInputValidators],
      ],
      email: [
        responsibleOfficerDetails?.email ?? null,
        [
          GovukValidators.required('Enter email address'),
          GovukValidators.maxLength(255, 'Email address should not be larger than 255 characters'),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        ],
      ],
      address: fb.group(CountyAddressInputComponent.controlsFactory(responsibleOfficerDetails?.address)),
    });
  },
};

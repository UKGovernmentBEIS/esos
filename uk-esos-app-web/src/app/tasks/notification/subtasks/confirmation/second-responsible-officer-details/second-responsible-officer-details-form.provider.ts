import { Provider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { phoneInputValidators } from '@shared/phone-input/phone-input.validators';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { sameResponsibleOfficerEmailValidator } from '@tasks/notification/subtasks/confirmation/confirmation.validators';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { ContactPerson } from 'esos-api';

import { addAddressProperty } from '../confirmation.helper';

export const SecondResponsibleOfficerDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const secondResponsibleOfficerDetails = addAddressProperty(
      store.select(notificationQuery.selectConfirmation)()?.secondResponsibleOfficerDetails ?? ({} as ContactPerson),
    );
    const firstResponsibleOfficerDetails = store.select(notificationQuery.selectConfirmation)()
      ?.responsibleOfficerDetails;

    return fb.group({
      firstName: [
        secondResponsibleOfficerDetails?.firstName ?? null,
        [
          GovukValidators.required('Enter first name'),
          GovukValidators.maxLength(255, 'First name should not be larger than 255 characters'),
        ],
      ],
      lastName: [
        secondResponsibleOfficerDetails?.lastName ?? null,
        [
          GovukValidators.required('Enter last name'),
          GovukValidators.maxLength(255, 'Last name should not be larger than 255 characters'),
        ],
      ],
      jobTitle: [
        secondResponsibleOfficerDetails?.jobTitle ?? null,
        [
          GovukValidators.required('Enter job title'),
          GovukValidators.maxLength(255, 'Job title should not be larger than 255 characters'),
        ],
      ],
      phoneNumber: [
        {
          countryCode: secondResponsibleOfficerDetails?.phoneNumber?.countryCode,
          number: secondResponsibleOfficerDetails?.phoneNumber?.number,
        },
        [GovukValidators.empty('Enter phone number'), ...phoneInputValidators],
      ],
      mobileNumber: [
        {
          countryCode: secondResponsibleOfficerDetails?.mobileNumber?.countryCode,
          number: secondResponsibleOfficerDetails?.mobileNumber?.number,
        },
        [...phoneInputValidators],
      ],
      email: [
        secondResponsibleOfficerDetails?.email ?? null,
        [
          GovukValidators.required('Enter email address'),
          GovukValidators.maxLength(255, 'Email address should not be larger than 255 characters'),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
          sameResponsibleOfficerEmailValidator(firstResponsibleOfficerDetails?.email),
        ],
      ],
      address: fb.group(CountyAddressInputComponent.controlsFactory(secondResponsibleOfficerDetails?.address)),
    });
  },
};

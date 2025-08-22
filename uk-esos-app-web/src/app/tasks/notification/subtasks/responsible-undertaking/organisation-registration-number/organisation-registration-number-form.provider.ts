import { UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { companiesHouseNumberExists } from '@shared/components/organisation-companies-house-form';
import { HouseCompanyDetailsService } from '@shared/services/house-company-details-service/house-company-details.service';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

export const organisationRegistrationNumberFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, HouseCompanyDetailsService],
  useFactory: (
    fb: UntypedFormBuilder,
    store: RequestTaskStore,
    houseCompanyDetailsService: HouseCompanyDetailsService,
  ) => {
    const state = store.select(notificationQuery.selectResponsibleUndertaking);
    const originatedOrganisationDetails = store.select(notificationQuery.selectAccountOriginatedData)()
      ?.organisationDetails;

    const organisationDetails = state()?.organisationDetails;

    return fb.group(
      {
        registrationNumberExist: [
          organisationDetails?.registrationNumberExist ?? !!originatedOrganisationDetails?.registrationNumber,
          GovukValidators.required('Select yes if the organisation is registered at Companies House'),
        ],
        registrationNumber: [
          organisationDetails?.registrationNumber ?? originatedOrganisationDetails?.registrationNumber,
          [
            GovukValidators.required('Enter the registration number'),
            GovukValidators.pattern('^[a-zA-Z0-9]{8}$', 'The registration number must be 8 characters'),
            GovukValidators.minLength(8, 'If your Company Registration Number has fewer than 8 numbers, add zeroes at the start'),
          ],
          [companiesHouseNumberExists(houseCompanyDetailsService)],
        ],
      },
      { updateOn: 'change' },
    );
  },
};

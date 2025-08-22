import { BusinessError, dashboardLink } from '@error/business-error/business-error';

import {
  organisationCompaniesHouseApiMessageServiceUnavailableError,
  organisationCompaniesHouseApiMessageUnauthorizedError,
  organisationCompaniesHouseNotExistsMessageError,
} from './organisation-companies-house-business-error';

const organisationAccountErrorFactory = (errorFactory: () => BusinessError) => errorFactory().withLink(dashboardLink);

const buildAccountRegistrationNumberExistsError = () => new BusinessError(accountRegistrationNumberExistsMessageError);

const buildOrganisationCompaniesHouseNotExistsError = () =>
  new BusinessError(organisationCompaniesHouseNotExistsMessageError);

const buildOrganisationCompaniesHouseApiServiceUnavailableError = () =>
  new BusinessError(organisationCompaniesHouseApiMessageServiceUnavailableError);

const buildOrganisationCompaniesHouseApiUnauthorizedError = () =>
  new BusinessError(organisationCompaniesHouseApiMessageUnauthorizedError);

export const accountRegistrationNumberExistsMessageError =
  'An organisation account already exists with the same registration number';

export const accountRegistrationNumberExistsError = organisationAccountErrorFactory(
  buildAccountRegistrationNumberExistsError,
);

export const organisationCompaniesHouseNotExistsError = organisationAccountErrorFactory(
  buildOrganisationCompaniesHouseNotExistsError,
);

export const organisationCompaniesHouseApiServiceUnavailableError = organisationAccountErrorFactory(
  buildOrganisationCompaniesHouseApiServiceUnavailableError,
);

export const organisationCompaniesHouseApiUnauthorizedError = organisationAccountErrorFactory(
  buildOrganisationCompaniesHouseApiUnauthorizedError,
);

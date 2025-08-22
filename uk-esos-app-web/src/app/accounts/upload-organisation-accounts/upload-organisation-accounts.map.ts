import { OrganisationAccountOnboardingRegistryDTO } from 'esos-api';

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const organisationAccountsCsvMap: Record<keyof OrganisationAccountOnboardingRegistryDTO, string> = {
  registrationNumber: 'CRN',
  email: 'Email',
};

export const organisationAccountsCSVMapper = (data: any): OrganisationAccountOnboardingRegistryDTO[] =>
  data.map((item: { [x: string]: unknown }) => ({
    registrationNumber: item?.[organisationAccountsCsvMap.registrationNumber],
    email: item?.[organisationAccountsCsvMap.email],
  }));

export const mapFieldsToColumnNames = (fields: [keyof OrganisationAccountOnboardingRegistryDTO]) => {
  return fields.map((field) => organisationAccountsCsvMap[field]);
};

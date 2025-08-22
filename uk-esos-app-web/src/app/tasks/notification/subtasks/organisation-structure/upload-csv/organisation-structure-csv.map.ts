export interface FlattenedOrganisationAssociatedWithRU {
  organisationName: string;
  registrationNumber: string;
  isPartOfArrangement: boolean;
  hasCeasedToBePartOfGroup: boolean;
  isPartOfFranchise: boolean;
  isParentOfResponsibleUndertaking: boolean;
  isSubsidiaryOfResponsibleUndertaking: boolean;
  areSameAsRU: boolean;
  type: 'SIC' | 'OTHER';
  otherTypeName: string;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
}

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const organisationStructureCsvMap: Record<keyof FlattenedOrganisationAssociatedWithRU, string> = {
  organisationName: 'Organisation Name',
  registrationNumber: 'Registration Number (if exists, otherwise leave the cell blank)',
  isPartOfArrangement:
    'Is this organisation part of an arrangement where 2 or more highest UK parent groups are complying as one participant?',
  hasCeasedToBePartOfGroup:
    'Has this organisation ceased to be part of the highest parent group or participant since the qualification date but agreed to comply as if it were still a member?',
  isPartOfFranchise: 'Is this organisation a franchisee?',
  isParentOfResponsibleUndertaking: 'Is this organisation a parent of the responsible undertaking?',
  isSubsidiaryOfResponsibleUndertaking: 'Is this organisation a subsidiary of the responsible undertaking?',
  areSameAsRU: 'Is the Code same as RU?',
  type: 'Select classification type if the organisation covered in this NOC',
  otherTypeName: 'Classification name (if other than SIC)',
  code1: 'Code 1',
  code2: 'Code 2 (Optional)',
  code3: 'Code 3 (Optional)',
  code4: 'Code 4 (Optional)',
};

export const organisationStructureCSVMapper = (data: any): FlattenedOrganisationAssociatedWithRU[] =>
  data.map(
    (item: { [x: string]: unknown }) =>
      ({
        organisationName: item?.[organisationStructureCsvMap.organisationName],
        registrationNumber: item?.[organisationStructureCsvMap.registrationNumber],
        isPartOfArrangement: item?.[organisationStructureCsvMap.isPartOfArrangement],
        hasCeasedToBePartOfGroup: item?.[organisationStructureCsvMap.hasCeasedToBePartOfGroup],
        isPartOfFranchise: item?.[organisationStructureCsvMap.isPartOfFranchise],
        isParentOfResponsibleUndertaking: item?.[organisationStructureCsvMap.isParentOfResponsibleUndertaking],
        isSubsidiaryOfResponsibleUndertaking: item?.[organisationStructureCsvMap.isSubsidiaryOfResponsibleUndertaking],
        areSameAsRU: item?.[organisationStructureCsvMap.areSameAsRU],
        type: item?.[organisationStructureCsvMap.type],
        otherTypeName: item?.[organisationStructureCsvMap.otherTypeName],
        code1: item?.[organisationStructureCsvMap.code1],
        code2: item?.[organisationStructureCsvMap.code2],
        code3: item?.[organisationStructureCsvMap.code3],
        code4: item?.[organisationStructureCsvMap.code4],
      } as FlattenedOrganisationAssociatedWithRU),
  );

export const mapFieldsToColumnNames = (fields: [keyof FlattenedOrganisationAssociatedWithRU]) => {
  return fields.map((field) => organisationStructureCsvMap[field]);
};
